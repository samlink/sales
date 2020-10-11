use crate::service::*;
use actix_identity::Identity;
use actix_web::{get, post, web, HttpResponse};
use deadpool_postgres::Pool;
// use serde::{Deserialize, Serialize};
// use time::now;

///获取全部单据
#[post("/fetch_all_documents")]
pub async fn fetch_all_documents(
    db: web::Data<Pool>,
    post_data: web::Json<TablePager>,
    id: Identity,
) -> HttpResponse {
    let user = get_user(db.clone(), id, post_data.cate.clone()).await;
    if user.name != "" {
        let doc_cate;
        let doc_pre;

        if post_data.cate == "采购查询" {
            doc_cate = "采购单据";
            doc_pre = "C";
        } else if post_data.cate == "销售查询" {
            doc_cate = "销售单据";
            doc_pre = "X";
        } else {
            doc_cate = "库存调整";
            doc_pre = "K";
        }
        let conn = db.get().await.unwrap();
        let skip = (post_data.page - 1) * post_data.rec;
        // let name = post_data.name.to_lowercase();

        let fields = get_inout_fields(db.clone(), doc_cate).await;

        let mut sql_fields = "SELECT 单号,已记账,".to_owned();

        for f in &fields {
            sql_fields += &format!("{},", f.field_name);
        }

        let sql = format!(
            r#"{} ROW_NUMBER () OVER (ORDER BY {}) as 序号,制单人 FROM documents WHERE 
            单号 like '{}%' ORDER BY {} OFFSET {} LIMIT {}"#,
            sql_fields, post_data.sort, doc_pre, post_data.sort, skip, post_data.rec
        );

        println!("{}", sql);

        //AND LOWER(名称) LIKE '%{}%'

        let rows = &conn.query(sql.as_str(), &[]).await.unwrap();
        let doc_rows: Vec<&str> = Vec::new(); 
        for row in rows {
            let num: i64 = row.get("序号");
            let dh: String = row.get("单号");
            let rem: bool = row.get("已记账");
            let maker: String = row.get("制单人");
            let row_str = format!("{}{}", simple_string_from_base(row,&fields));
        }

        let products = build_string_from_base(rows, fields);

        let count_sql = format!(
            r#"SELECT count(单号) as 记录数 FROM documents WHERE 单号 like '{}%'"#,
            doc_pre
        );

        let rows = &conn.query(count_sql.as_str(), &[]).await.unwrap();

        let mut count: i64 = 0;
        for row in rows {
            count = row.get("记录数");
        }
        let pages = (count as f64 / post_data.rec as f64).ceil() as i32;
        HttpResponse::Ok().json((products, count, pages))
    } else {
        HttpResponse::Ok().json(-1)
    }
}