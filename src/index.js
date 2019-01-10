const { app, BrowserWindow, Menu } = require('electron');

const url = require('url');
const path = require('path');

const MongoClient = require('mongodb').MongoClient;
const urlm = "mongodb://localhost:27017/";


let mainWindow


app.on('ready', () => {
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/index.html'),
        protocol: 'file',
        slashes: true
    }));

    const mainMenu = Menu.buildFromTemplate(templateMenu);
    Menu.setApplicationMenu(mainMenu);

    mainWindow.on('close', () => {
        app.quit();
    });
});

function createWindow(month) {
    const remote = require('electron').remote;
    const BrowserWindow = remote.BrowserWindow;

    var win = new BrowserWindow({});
    win.loadURL(url.format({
        pathname: path.join(__dirname, month + '.html'),
        protocol: 'file',
        slashes: true
    }));

    //win.setMenu(null);
}

function createWindowALL() {
    const remote = require('electron').remote;
    const BrowserWindow = remote.BrowserWindow;

    var win = new BrowserWindow({});
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'allproducts.html'),
        protocol: 'file',
        slashes: true
    }));

    //win.setMenu(null);
}

function getValues(month) {
    const name = document.querySelector('#name').value;
    const price = document.querySelector('#price').value;
    var date;

    if (document.querySelector('#date').value == '') {
        var f = new Date();
        date = f.getDate() + '/' + (f.getMonth() + 1).toString() + '/' + f.getFullYear();
    } else {
        date = document.querySelector('#date').value;
    }

    const idRow = name + month;


    const gasto = `
        <tr class="table-danger" id="${idRow}">
        <td><strong name="gasto">${name.toUpperCase()}</strong></td>
        <td name="itemPrice">${price}</td>
        <td name="fecha">${date}</td>
        <td><button class="btn btn-danger" onclick="removeItem('${idRow}', '${month}');">Eliminar</button></td>
        </tr>
        `;

    document.getElementById('input').innerHTML += gasto;


    insertMongo(idRow, month, name, price, date);

    document.querySelector('#name').value = '';
    document.querySelector('#price').value = '';
    document.querySelector('#date').value = '';
}

function removeItem(itemID, month) {
    producto = new Array();
    nombreA = new Array();
    precioA = new Array();
    fechaA = new Array();

    producto = document.getElementById(itemID).innerHTML.split('>');
    nombreA = producto[2].split('<');
    precioA = producto[5].split('<');
    fechaA = producto[7].split('<');

    var nombre = nombreA[0];
    var precio = precioA[0];
    var fecha = fechaA[0];

    removeMongo(month, nombre, precio, fecha);

    document.getElementById(itemID).remove();
}

function getTotalPrice() {
    var cont = 0;
    var prices = Array();

    prices = document.getElementsByName('itemPrice');

    prices.forEach(i => {
        cont = cont + parseInt(i.innerHTML);
    });

    document.getElementById('total').innerHTML = '';

    const total = `<label><h4 class="text-danger"><strong>$  ${cont}   </strong></h4></label>`;

    document.getElementById('total').innerHTML += total;
}











/////////////////////////////////////////////////////////////////////////////////////


//////////// FUNCIONES MONGO

function insertMongo(idrow, month, name, price, date) {
    var producto = {
        idrow: "",
        mes: "",
        nombre: "",
        precio: "",
        fecha: ""
    };

    producto.idrow = idrow;
    producto.mes = month;
    producto.nombre = name;
    producto.precio = price;
    producto.fecha = date;

    MongoClient.connect(urlm, true, function (err, db) {
        if (err) throw err;
        var dbo = db.db("electron");
        dbo.collection("products").insertOne(producto, function (err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });
    });
}


function removeMongo(month, name, price, date) {
    var producto = {
        mes: "",
        nombre: "",
        precio: "",
        fecha: ""
    };

    producto.mes = month;
    producto.nombre = name.toLowerCase();
    producto.precio = price;
    producto.fecha = date;


    MongoClient.connect(urlm, function (err, db) {
        if (err) throw err;
        var dbo = db.db("electron");
        dbo.collection("products").deleteOne(producto, function (err, obj) {
            if (err) throw err;
            console.log("1 document deleted");
            db.close();
        });
    });
}

function allMongo(month) {
    var producto = {
        mes: ""
    };

    producto.mes = month;    

    MongoClient.connect(urlm, function (err, db) {
        if (err) throw err;
        var dbo = db.db("electron");
        dbo.collection("products").find(producto, { projection: { _id: 0 } }).toArray(function (err, result) {
            if (err) throw err;
            result.forEach(i => {
                console.log(i.idrow);
                const gasto = `
                <tr class="table-danger" id="${i.idrow}">
                <td><strong name="gasto">${i.nombre.toUpperCase()}</strong></td>
                <td name="itemPrice">${i.precio}</td>
                <td name="fecha">${i.fecha}</td>
                <td><button class="btn btn-danger" onclick="removeItem('${i.idrow}', '${month}');">Eliminar</button></td>
                </tr>
                `;

                document.getElementById('input').innerHTML += gasto;
            });
            db.close();
        });
    });

}

function fullMongo() {
    MongoClient.connect(urlm, function (err, db) {
        if (err) throw err;
        var dbo = db.db("electron");
        dbo.collection("products").find({}, { projection: { _id: 0 } }).toArray(function (err, result) {
            if (err) throw err;
            result.forEach(i => {
                console.log(i.idrow);
                const gasto = `
                <tr class="table-danger" id="${i.idrow}">
                <td><strong name="gasto">${i.nombre.toUpperCase()}</strong></td>
                <td name="itemPrice">${i.precio}</td>
                <td name="fecha">${i.fecha}</td>
                <td>${i.mes}</td>
                </tr>
                `;

                document.getElementById('input').innerHTML += gasto;
            });
            db.close();
        });
    });

}













/////////////////////////////////////////////////////////////////////////////////////


//////////// MENU

const templateMenu = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Quit',
                accelerator: 'Ctrl + Q',
                click() {
                    app.quit();
                }
            }
        ]
    },
    {
        label: 'Dev Tools',
        submenu: [
            {
                label: 'Show/Hide Dev Tools',
                accelerator: 'Ctrl + D',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            }
        ]
    }
];

