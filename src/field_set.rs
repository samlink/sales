use crate::service::get_user;
use actix_identity::Identity;
use actix_web::{post, web, HttpResponse};
use deadpool_postgres::Pool;
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
pub struct FieldsReturn {
    pub id: i32,
    pub num: i64,
    pub field_name: String,
    pub data_type: String,
    pub show_name: String,
    pub show_width: f32,
    pub ctr_type: String,
    pub option_value: String,
    pub is_show: bool,
    pub show_order: i32,
    pub rust_name: String,
}

#[derive(Deserialize, Serialize)]
pub struct FieldsPost {
    name: String,
}

///获取表格字段
#[post("/fetch_fields")]
pub async fn fetch_fields(
    db: web::Data<Pool>,
    post_data: web::Json<FieldsPost>,
    id: Identity,
) -> HttpResponse {
    let user = get_user(db.clone(), id, "字段设置".to_owned()).await;
    if user.name != "" {
        let conn = db.get().await.unwrap();
        let sql = format!(
            "SELECT *, ROW_NUMBER () OVER (ORDER BY show_order) as 序号 
                    FROM tableset WHERE table_name='{}' ORDER BY show_order",
            post_data.name
        );
        let rows = &conn.query(sql.as_str(), &[]).await.unwrap();

        let mut fields: Vec<FieldsReturn> = Vec::new();

        for row in rows {
            let field = FieldsReturn {
                id: row.get("ID"),
                num: row.get("序号"),
                field_name: row.get("field_name"),
                data_type: row.get("data_type"),
                show_name: row.get("show_name"),
                show_width: row.get("show_width"),
                ctr_type: row.get("ctr_type"),
                option_value: row.get("option_value"),
                is_show: row.get("is_show"),
                show_order: row.get("show_order"),
                rust_name: row.get("rust_name"),
            };

            fields.push(field);
        }

        let rows = &conn
            .query(
                r#"SELECT count("ID") as 记录数 FROM tableset WHERE table_name=$1"#,
                &[&post_data.name],
            )
            .await
            .unwrap();

        let mut count: i64 = 0;
        for row in rows {
            count = row.get("记录数");
        }
        HttpResponse::Ok().json((fields, count))
    } else {
        HttpResponse::Ok().json(-1)
    }
}

#[derive(Deserialize, Serialize)]
pub struct FieldsData {
    pub id: i32,
    pub show_name: String,
    pub show_width: f32,
    pub ctr_type: String,
    pub option_value: String,
    pub is_show: bool,
    pub show_order: i32,
}

///更新表格字段数据
#[post("/update_tableset")]
pub async fn update_tableset(
    db: web::Data<Pool>,
    post_data: web::Json<Vec<FieldsData>>,
    id: Identity,
) -> HttpResponse {
    let user = get_user(db.clone(), id, "字段设置".to_owned()).await;
    if user.name != "" {
        let conn = db.get().await.unwrap();
        //加 into_inner() 方法，否则会出现错误：Cannot move out of dereference of ...
        let post_data = post_data.into_inner();
        for data in post_data {
            let sql = format!(
                r#"UPDATE tableset SET show_name='{}', show_width={}, ctr_type='{}', option_value='{}', is_show={}, 
                show_order={} WHERE "ID"={}"#,
                data.show_name,
                data.show_width,
                data.ctr_type,
                data.option_value,
                data.is_show,
                data.show_order,
                data.id
            );

            &conn.execute(sql.as_str(), &[]).await.unwrap();
        }

        HttpResponse::Ok().json(1)
    } else {
        HttpResponse::Ok().json(-1)
    }
}