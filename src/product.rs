use crate::service::get_user;
use actix_identity::Identity;
use actix_web::{get, post, web, HttpResponse};
use deadpool_postgres::Pool;
use serde::{Deserialize, Serialize};
use xlsxwriter::*;

#[derive(Deserialize, Serialize)]
pub struct FrontData {
    pub id: String,
    pub name: String,
    pub page: i32,
    pub sort: String,
    pub rec: i32,
}

//结构中的变量名与数据库中字段 rust_name 一致，便于前端操作
#[derive(Deserialize, Serialize)]
pub struct Product {
    pub num: i64,
    pub id: i32,
    pub name_id: String,
    pub p_type: String,
    pub price: f32,
    pub p_limit: i32,
    pub not_use: bool,
    pub note: String,
    pub unit: String,
    pub text1: String,
    pub text2: String,
    pub text3: String,
    pub text4: String,
    pub text5: String,
    pub text6: String,
    pub text7: String,
    pub text8: String,
    pub text9: String,
    pub text10: String,
    pub integer1: i32,
    pub integer2: i32,
    pub integer3: i32,
    pub integer4: i32,
    pub integer5: i32,
    pub integer6: i32,
    pub real1: f32,
    pub real2: f32,
    pub real3: f32,
    pub real4: f32,
    pub real5: f32,
    pub real6: f32,
    pub bool1: bool,
    pub bool2: bool,
    pub bool3: bool,
}

///获取商品
#[post("/fetch_product")]
pub async fn fetch_product(
    db: web::Data<Pool>,
    post_data: web::Json<FrontData>,
    id: Identity,
) -> HttpResponse {
    let user = get_user(db.clone(), id, "商品设置".to_owned()).await;
    if user.name != "" {
        let conn = db.get().await.unwrap();
        let skip = (post_data.page - 1) * post_data.rec;
        let name = post_data.name.to_lowercase();
        let sql = format!(
            r#"SELECT "ID",规格型号,出售价格,库存下限,停用,备注,单位,文本字段1,文本字段2,文本字段3,
                    文本字段4,文本字段5,文本字段6,文本字段7,文本字段8,文本字段9,文本字段10,
                    整数字段1,整数字段2,整数字段3,整数字段4,整数字段5,整数字段6,
                    实数字段1,实数字段2,实数字段3,实数字段4,实数字段5,实数字段6,
                    布尔字段1,布尔字段2,布尔字段3,
                    ROW_NUMBER () OVER (ORDER BY {}) as 序号
                    FROM products WHERE "商品ID"='{}' AND LOWER(规格型号) LIKE '%{}%' ORDER BY {} OFFSET {} LIMIT {}"#,
            post_data.sort, post_data.id, name, post_data.sort, skip, post_data.rec
        );

        let rows = &conn.query(sql.as_str(), &[]).await.unwrap();

        let mut products = Vec::new();

        for row in rows {
            let product = Product {
                num: row.get("序号"),
                id: row.get("ID"),
                name_id: "".to_string(),
                p_type: row.get("规格型号"),
                price: row.get("出售价格"),
                p_limit: row.get("库存下限"),
                not_use: row.get("停用"),
                note: row.get("备注"),
                unit: row.get("单位"),
                text1: row.get("文本字段1"),
                text2: row.get("文本字段2"),
                text3: row.get("文本字段3"),
                text4: row.get("文本字段4"),
                text5: row.get("文本字段5"),
                text6: row.get("文本字段6"),
                text7: row.get("文本字段7"),
                text8: row.get("文本字段8"),
                text9: row.get("文本字段9"),
                text10: row.get("文本字段10"),
                integer1: row.get("整数字段1"),
                integer2: row.get("整数字段2"),
                integer3: row.get("整数字段3"),
                integer4: row.get("整数字段4"),
                integer5: row.get("整数字段5"),
                integer6: row.get("整数字段6"),
                real1: row.get("实数字段1"),
                real2: row.get("实数字段2"),
                real3: row.get("实数字段3"),
                real4: row.get("实数字段4"),
                real5: row.get("实数字段5"),
                real6: row.get("实数字段6"),
                bool1: row.get("布尔字段1"),
                bool2: row.get("布尔字段2"),
                bool3: row.get("布尔字段3"),
            };
            products.push(product);
        }

        let rows = &conn
            .query(
                r#"SELECT count("ID") as 记录数 FROM products WHERE "商品ID"=$1 AND LOWER(规格型号) LIKE '%' || $2 || '%'"#,
                &[&post_data.id, &name],
            )
            .await
            .unwrap();

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

///编辑更新产品
#[post("/update_product")]
pub async fn update_product(
    db: web::Data<Pool>,
    data: web::Json<Product>, //作为前端回传数据时，num 为商品ID, 而非序号
    id: Identity,
) -> HttpResponse {
    let user = get_user(db.clone(), id, "商品设置".to_owned()).await;
    if user.name != "" {
        let conn = db.get().await.unwrap();
        let sql = format!(
            r#"UPDATE products SET "商品ID"='{}',规格型号='{}',出售价格={},库存下限={},停用={},备注='{}',单位='{}',文本字段1='{}',
                文本字段2='{}',文本字段3='{}',文本字段4='{}',文本字段5='{}',文本字段6='{}',文本字段7='{}',文本字段8='{}',文本字段9='{}',
                文本字段10='{}',整数字段1={},整数字段2={},整数字段3={},整数字段4={},整数字段5={},整数字段6={},实数字段1={},实数字段2={},
                实数字段3={},实数字段4={},实数字段5={},实数字段6={},布尔字段1={},布尔字段2={},布尔字段3={}
                WHERE "ID"='{}'"#,
            data.name_id,
            data.p_type,
            data.price,
            data.p_limit,
            data.not_use,
            data.note,
            data.unit,
            data.text1,
            data.text2,
            data.text3,
            data.text4,
            data.text5,
            data.text6,
            data.text7,
            data.text8,
            data.text9,
            data.text10,
            data.integer1,
            data.integer2,
            data.integer3,
            data.integer4,
            data.integer5,
            data.integer6,
            data.real1,
            data.real2,
            data.real3,
            data.real4,
            data.real5,
            data.real6,
            data.bool1,
            data.bool2,
            data.bool3,
            data.id,
        );

        &conn.execute(sql.as_str(), &[]).await.unwrap();

        HttpResponse::Ok().json(1)
    } else {
        HttpResponse::Ok().json(-1)
    }
}

///编辑更新产品
#[post("/add_product")]
pub async fn add_product(
    db: web::Data<Pool>,
    data: web::Json<Product>, //作为前端回传数据时，num 为商品ID, 而非序号
    id: Identity,
) -> HttpResponse {
    let user = get_user(db.clone(), id, "商品设置".to_owned()).await;
    if user.name != "" {
        let conn = db.get().await.unwrap();
        let sql = format!(
            r#"INSERT INTO products ("商品ID",规格型号,出售价格,库存下限,停用,备注,单位,文本字段1,文本字段2,文本字段3,文本字段4,文本字段5,文本字段6,
                文本字段7,文本字段8,文本字段9,文本字段10,整数字段1,整数字段2,整数字段3,整数字段4,整数字段5,整数字段6,实数字段1,实数字段2,实数字段3,
                实数字段4,实数字段5,实数字段6,布尔字段1,布尔字段2,布尔字段3) VALUES('{}','{}',{},{},{},'{}','{}','{}','{}','{}','{}','{}','{}',
                '{}','{}','{}','{}',{},{},{},{},{},{},{},{},{},{},{},{},{},{},{})"#,
            data.name_id,
            data.p_type,
            data.price,
            data.p_limit,
            data.not_use,
            data.note,
            data.unit,
            data.text1,
            data.text2,
            data.text3,
            data.text4,
            data.text5,
            data.text6,
            data.text7,
            data.text8,
            data.text9,
            data.text10,
            data.integer1,
            data.integer2,
            data.integer3,
            data.integer4,
            data.integer5,
            data.integer6,
            data.real1,
            data.real2,
            data.real3,
            data.real4,
            data.real5,
            data.real6,
            data.bool1,
            data.bool2,
            data.bool3
        );

        &conn.execute(sql.as_str(), &[]).await.unwrap();

        HttpResponse::Ok().json(1)
    } else {
        HttpResponse::Ok().json(-1)
    }
}

///获取一条空记录，用于无数据表格初始化
#[post("/fetch_blank")]
pub fn fetch_blank() -> HttpResponse {
    let v: Vec<i32> = Vec::new();
    HttpResponse::Ok().json((v, 0, 0))
}

#[derive(Deserialize)]
pub struct Search {
    s: String,
    cate: String,
}

#[derive(Deserialize, Serialize)]
pub struct Message {
    id: i32,
    label: String,
}

//自动完成
#[get("/product_auto")]
pub async fn product_auto(
    db: web::Data<Pool>,
    search: web::Query<Search>,
    id: Identity,
) -> HttpResponse {
    let user_name = id.identity().unwrap_or("".to_owned());
    if user_name != "" {
        let conn = db.get().await.unwrap();
        let s = ("%".to_owned() + &search.s + "%").to_lowercase();
        let rows = &conn
            .query(
                r#"SELECT "ID" AS id, 规格型号 AS label FROM products WHERE "商品ID"=$2 AND LOWER(规格型号) LIKE $1 LIMIT 10"#, //查询字段名称与结构名称对应
                &[&s, &search.cate],
            )
            .await
            .unwrap();

        let mut data: Vec<Message> = vec![];
        for row in rows {
            let message = Message {
                id: row.get("id"),
                label: row.get("label"),
            };

            data.push(message);
        }

        HttpResponse::Ok().json(data)
    } else {
        HttpResponse::Ok().json(-1)
    }
}

#[derive(Deserialize, Serialize)]
pub struct ProductName {
    id: String,
    name: String,
}

//导出数据
#[post("/product_out")]
pub async fn product_out(
    db: web::Data<Pool>,
    product: web::Json<ProductName>,
    id: Identity,
) -> HttpResponse {
    let user = get_user(db.clone(), id, "导出数据".to_owned()).await;
    if user.name != "" {
        let conn = db.get().await.unwrap();
        let rows = &conn
            .query(
                r#"SELECT field_name, show_name, data_type, option_value, show_width 
                    FROM tableset WHERE table_name='商品规格' AND is_show=true ORDER BY show_order"#,
                &[],
            )
            .await
            .unwrap();

        let mut fields: Vec<(String, String, String, String, f32)> = Vec::new();
        for row in rows {
            fields.push((
                row.get("field_name"),
                row.get("show_name"),
                row.get("data_type"),
                row.get("option_value"),
                row.get("show_width"),
            ));
        }

        let file_name = format!("./download/{}.xlsx", product.name);
        let wb = Workbook::new(&file_name);
        let mut sheet = wb.add_worksheet(Some("数据")).unwrap();

        let format1 = wb
            .add_format()
            .set_align(FormatAlignment::CenterAcross)
            .set_bold(); //设置格式：居中，加粗

        let format2 = wb.add_format().set_align(FormatAlignment::CenterAcross);

        //设置列宽
        sheet.set_column(0, 0, 8.0, None).unwrap();
        sheet.set_column(1, 1, 12.0, None).unwrap();

        sheet.write_string(0, 0, "编号", Some(&format1)).unwrap();
        sheet.write_string(0, 1, "商品ID", Some(&format1)).unwrap();

        let mut n = 2;
        for f in &fields {
            sheet.write_string(0, n, &f.1, Some(&format1)).unwrap();
            sheet.set_column(n, n, (f.4 * 2.5).into(), None).unwrap();

            n += 1;
        }

        let mut sql = r#"SELECT "ID"::float8 as 编号,"#.to_owned();
        for f in &fields {
            if f.2 == "文本" {
                let txt = format!("{},", f.0);
                sql += &txt;
            } else if f.2 == "整数" || f.2 == "实数" {
                let num = format!("{}::float8,", f.0);
                sql += &num;
            } else {
                let op: Vec<&str> = f.3.split("_").collect();
                let bl = format!(
                    "case when {} then '{}' else '{}' end as {},",
                    f.0, op[0], op[1], f.0
                );
                sql += &bl;
            }
        }

        let tail = format!(r#""商品ID" FROM products WHERE "商品ID"='{}'"#, product.id);
        sql += &tail;

        let rows = &conn.query(sql.as_str(), &[]).await.unwrap();

        let mut n = 1u32;
        for row in rows {
            sheet
                .write_number(n, 0, row.get("编号"), Some(&format2))
                .unwrap();
            sheet
                .write_string(n, 1, row.get("商品ID"), Some(&format2))
                .unwrap();

            let mut m = 2u16;
            for f in &fields {
                if f.2 == "整数" || f.2 == "实数" {
                    sheet.write_number(n, m, row.get(&*f.0), None).unwrap();
                } else if f.2 == "文本" {
                    sheet.write_string(n, m, row.get(&*f.0), None).unwrap();
                } else {
                    sheet
                        .write_string(n, m, row.get(&*f.0), Some(&format2))
                        .unwrap();
                }

                m += 1;
            }

            n += 1;
        }

        wb.close().unwrap();
        HttpResponse::Ok().json(product.name.clone())
    } else {
        HttpResponse::Ok().json(-1)
    }
}
