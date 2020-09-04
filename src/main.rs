use actix_files as fs;
use actix_identity::{CookieIdentityPolicy, IdentityService};
use actix_web::{web, App, HttpServer};
use config::ConfigError;
use dotenv::dotenv;
use serde::Deserialize;

mod html;
mod service;
mod tree;
mod user_manage;
mod user_set;

#[derive(Deserialize)]
struct Config {
    pg: deadpool_postgres::Config,
}

impl Config {
    fn from_env() -> Result<Self, ConfigError> {
        let mut cfg = ::config::Config::new();
        cfg.merge(::config::Environment::new().separator("__"))?;
        cfg.try_into()
    }
}

#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    let config = Config::from_env().unwrap();
    let pool = config.pg.create_pool(tokio_postgres::NoTls).unwrap();
    println!("服务已启动: 127.0.0.1:8083");

    HttpServer::new(move || {
        App::new()
            .data(pool.clone())
            .wrap(IdentityService::new(
                CookieIdentityPolicy::new(&[6; 32])
                    .name("auth-sales")
                    .max_age(2592000) //30天
                    .secure(false),
            ))
            .service(html::index)
            .service(html::login)
            .service(html::user_set)
            .service(html::user_manage)
            .service(html::product_set)
            .service(user_set::login)
            .service(user_set::logon)
            .service(user_set::logout)
            .service(user_set::forget_pass)
            .service(user_set::change_pass)
            .service(user_set::phone_number)
            .service(user_manage::fetch_users)
            .service(user_manage::edit_user)
            .service(user_manage::del_user)
            .service(tree::tree)
            .service(tree::tree_add)
            .service(tree::tree_edit)
            .service(tree::tree_del)
            .service(tree::tree_auto)
            .service(web::resource("static/{name}").to(service::serve_static))
            .service(fs::Files::new("/assets", "assets"))
    })
    .bind("127.0.0.1:8083")?
    .run()
    .await
}
