const { app, BrowserWindow, Menu } = require('electron');

const url = require('url');
const path = require('path');

const Datastore = require('nedb');
const db = new Datastore({ filename: './products', autoload: true });


let mainWindow


app.on('ready', () => {
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/index.html'),
        protocol: 'file',
        slashes: true
    }));

    //const mainMenu = Menu.buildFromTemplate(templateMenu);
    //Menu.setApplicationMenu(mainMenu);

    mainWindow.on('close', () => {
        app.quit();
    });

    mainWindow.setMenu(null);
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

    win.setMenu(null);
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

    win.setMenu(null);
}

function getValuesI(month) {
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
        <tr class="table-success" id="${idRow}">
        <td><strong name="gasto">${name.toUpperCase()}</strong></td>
        <td name="itemPrice">${price}</td>
        <td name="fecha">${date}</td>
        <td><button class="btn btn-danger" onclick="removeItem('${idRow}', '${month}');">Eliminar</button></td>
        </tr>
        `;

    document.getElementById('input').innerHTML += gasto;


    insertNeDB(idRow, month, name, price, date);

    document.querySelector('#name').value = '';
    document.querySelector('#price').value = '';
    document.querySelector('#date').value = '';
}

function getValuesG(month) {
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

    var pricetd = '-' + price;

    const gasto = `
        <tr class="table-danger" id="${idRow}">
        <td><strong name="gasto">${name.toUpperCase()}</strong></td>
        <td name="itemPrice">${pricetd}</td>
        <td name="fecha">${date}</td>
        <td><button class="btn btn-danger" onclick="removeItem('${idRow}', '${month}');">Eliminar</button></td>
        </tr>
        `;

    document.getElementById('input').innerHTML += gasto;


    insertNeDB(idRow, month, name, pricetd, date);

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

    removeNeDB(month, nombre, precio, fecha);

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

    const total = `<label><h4 class="text-primary"><strong>$  ${cont}   </strong></h4></label>`;

    document.getElementById('total').innerHTML += total;
}











/////////////////////////////////////////////////////////////////////////////////////


//////////// FUNCIONES NeDB

function insertNeDB(idrow, month, name, price, date) {
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

    db.insert(producto, function (err, newDoc) {
        if (err) {
            console.log(err);
        } else {
            console.log(newDoc);
        }
    });
}


function removeNeDB(month, name, price, date) {
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


    db.remove(producto, function (err, newDoc) {
        if (err) {
            console.log(err);
        } else {
            console.log(newDoc);
        }
    });
}

function allNeDB(month) {
    var producto = {
        mes: ""
    };

    producto.mes = month;

    db.find(producto, function (err, newDoc) {
        if (err) {
            console.log(err);
        } else {
            newDoc.forEach(i => {
                if (i.precio < 0) {
                    const gasto = `
                <tr class="table-danger" id="${i.idrow}">
                <td><strong name="gasto">${i.nombre.toUpperCase()}</strong></td>
                <td name="itemPrice">${i.precio}</td>
                <td name="fecha">${i.fecha}</td>
                <td><button class="btn btn-danger" onclick="removeItem('${i.idrow}', '${month}');">Eliminar</button></td>
                </tr>
                `;

                    document.getElementById('input').innerHTML += gasto;
                } else {
                    const ingreso = `
                <tr class="table-success" id="${i.idrow}">
                <td><strong name="gasto">${i.nombre.toUpperCase()}</strong></td>
                <td name="itemPrice">${i.precio}</td>
                <td name="fecha">${i.fecha}</td>
                <td><button class="btn btn-danger" onclick="removeItem('${i.idrow}', '${month}');">Eliminar</button></td>
                </tr>
                `;

                    document.getElementById('input').innerHTML += ingreso;
                }
            });
        }
    });

}

function fullNeDB() {
    db.find({}, { projection: { _id: 0 } }, function (err, newDoc) {
        if (err) {
            console.log(err);
        } else {
            newDoc.forEach(i => {
                if (i.precio < 0) {
                    const gasto = `
                <tr class="table-danger" id="${i.idrow}">
                <td><strong name="gasto">${i.nombre.toUpperCase()}</strong></td>
                <td name="itemPrice">${i.precio}</td>
                <td name="fecha">${i.fecha}</td>
                <td>${i.mes}</td>
                </tr>
                `;

                    document.getElementById('input').innerHTML += gasto;
                } else {
                    const ingreso = `
                <tr class="table-success" id="${i.idrow}">
                <td><strong name="gasto">${i.nombre.toUpperCase()}</strong></td>
                <td name="itemPrice">${i.precio}</td>
                <td name="fecha">${i.fecha}</td>
                <td>${i.mes}</td>
                </tr>
                `;

                    document.getElementById('input').innerHTML += ingreso;
                }

            });
        }
    });

}













/////////////////////////////////////////////////////////////////////////////////////


//////////// MENU

/*
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
*/
