const http = require("http")
const fs = require("fs")

function createServer(){
    let obj = new Object();

    obj.routesGet = new Object();
    obj.routesPost = new Object();
    obj.uses = new Array();

    obj.get = (path, callbackRequestResponse) => {
        obj.routesGet[path] = callbackRequestResponse
    }
    obj.post = (path, callbackRequestResponse) => {
        obj.routesPost[path] = callbackRequestResponse
    }

    obj.use = (path, callbackUseRequestResponse) => {
        if(typeof path == "function"){
            obj.uses.push(path)
        } else {
            obj.uses.push((req, res) => {
                if(req.url == path){
                    callbackUseRequestResponse(req, res)
                }
            })
        }
    }

    obj.render = (req, res) => {
        obj.uses.forEach(c => {
            c(req, res)
        })

        try{
            if(req.method == "GET"){
                obj.routesGet[req.url](req, res)
            } else if(req.method == "POST"){
                obj.routesPost[req.url](req, res)
            }
            res.end()
        } catch(err){
            res.end()
        }
    }

    obj.listen = (port, callbackError) => {
        const s = http.createServer((req, res) => {
            res.sendFile = (filePath) => {
                const f1 = fs.readFileSync(filePath)
                const f2 = String(f1)
                res.write(f2)
            }


            obj.render(req, res);
        })

        s.listen(port, callbackError);
    }

    return obj
}

module.exports = createServer