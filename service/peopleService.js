var dbConfig = require("../config/db")
var arangojs = require("arangojs")
var DB = new arangojs.Database({
    url:dbConfig.url
})
//penggunaan database
DB.useDatabase(dbConfig.database)
// Authentication
DB.useBasicAuth(dbConfig.username,dbConfig.password)

let People = DB.collection("people")

var service = {
    create: function(people,res){
        if(Object.keys(people).length <= 0) 
            return res({
                status:false,
                message:"Data tidak boleh kosong"
            })
        let status = People.save(people)
        if (status !== false)
            return res({
                status : true,
                message : "Data berhasil disimpan"
            })
        else
        return res({
            status : false,
            message : "Data Gagal disimpan"
        })
    },
    update: function(people,res){
        if(!people._key) 
            return res({
                status:false,
                message:"Data tidak boleh kosong"
            })
        let status = People.update(people._key,people)
        if (status !== false)
            return res({
                status : true,
                message : "Data berhasil diupdate"
            })
        else
        return res({
            status : false,
            message : "Data Gagal diupdate"
        })
    },
    findAll:function(){
        return People.all()
    },
    findByKey:function(key){
        if(!key)
            return({
                status: false,
                message : "Key tidak boleh kosong"
            })
        else{
            try {
                return People.firstExample({
                    _key : key
                })
            } catch (error) {
                return ({
                    status : false,
                    message : "data tidak ditemukan"
                })
            }
        }
    },
    delete:function(key){
        return People.removeByKeys([key]);
    },
    getLimit:function(offset,limit,res) {
        DB.query(`FOR doc in people LIMIT ${offset},${limit} RETURN doc`)
        .then(cursor=>cursor.all())
        .then(data=>{
            return res(data);
        })
    },
    count:function() {
        return People.count()
    }
}

module.exports = service