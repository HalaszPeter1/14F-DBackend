const connection = require('../config/db');


const users = {
    getAllUsers(req, res) {
        let sql = 'select * from users'
        connection.query(sql, (err, data) => {
            if (err) {
                res.status(500).send({
                    message: err.message || 'Unkown error'
                })
            }
            else {
                res.send(data); //adatküldés
            }

        });
    },
    getUsersById(req,res){
        const id = req.params.id;
        const sql = 'select * from users where id = ?'
        connection.query(sql,id, (err, data) => {
            if (err) {
                res.status(500).send({
                    message: err.message || 'Unkown error'
                })
            }
            else {
                if (data.length == 0) {
                    res.status(404).send({
                        message: 'Not found.'
                    });
                    return;
                }
                res.send(data);
            }
        });
    },
    create(req, res) {
        if (validate(req, res)) { return }

        const newUser = {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            role: "standard"
        };
        const sql = 'insert into users set ?';
        connection.query(sql, newUser, (err, data) => {
            if (err) {
                res.status(500).send({
                    message: err.message || 'Unkown error'
                })
            }
            else {
                res.send(
                    {
                        id: data.insertId,
                        ...newUser
                    }
                );
            }
        })
    },
    update(req, res) {
        if (validate(req, res)) { return }
        const id = req.params.id;
        const user = {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
        }
        const sql = "update users set username = ?, password = ?, email = ? where id = ?";
        connection.query(
            sql,
            [user.username, user.password, user.email, id],
            (err, data) => {
                if (err) {
                    res.status(500).send({
                        message: err.message || 'Unkown error'
                    })
                }
                else {
                    if (data.affectedRows == 0) {
                        res.status(404).send({
                            message: `Not found user with id: ${req.params.id}.`
                        });
                    }
                    res.send({
                        id: id,
                        ...user
                    })
                }
            }
        );
    },
    delete(req, res) {
        const id = req.params.id;
        const sql = 'delete from users where id = ?'
        connection.query(
            sql,
            id,
            (err, data) => {
                if (err) {
                    res.status(500).send({
                        message: err.message || 'Unkown error'
                    })
                }
                else {
                    if (data.affectedRows == 0) {
                        // nincs ilyen ID-jü rekord
                        res.status(404).send({
                            message: `Not found user with id: ${req.params.id}.`
                        });
                        return; //kilépés a fv-ből
                    }
                    res.send({
                        message: "User was successfully deleted!"
                    })
                }
            }
        )
    },
}

function validate(req, res) {
    //console.log(req.body)
    if (JSON.stringify(req.body) == {}) {
        res.status(400).send({
            message: 'Content cannot be empty!'
        });
        return true;
    }
    if (req.body.username=='') {
        res.status(400).send({
            message: 'Username required!'
        });
        return true;
    }
    if (req.body.password=='') {
        res.status(400).send({
            message: 'Password required!'
        });
        return true;
    }
    if (req.body.email=='') {
        res.status(400).send({
            message: 'Email required!'
        });
        return true;
    }
}

module.exports = users;