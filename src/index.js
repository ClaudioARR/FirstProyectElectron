const { app, BrowserWindow, Menu } = require('electron');

const url = require('url');
const path = require('path');

if (process.env.NODE_ENV !== 'production') {

    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
    });
}

let mainWindow
let eneroWindow

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

    win.setMenu(null);
}

function getValues(month) {
    const name = document.querySelector('#name').value;
    const price = document.querySelector('#price').value;
    var date;

    if(document.querySelector('#date').value == ''){
        var f = new Date();
        date = f.getDate() + '/' + (f.getMonth() + 1).toString() + '/' + f.getFullYear();
    }else{
        date = document.querySelector('#date').value;
    }

    const idRow = name + month;
    

    const gasto = `
        <tr class="table-danger" id="${idRow}">
        <td><strong>${name.toUpperCase()}</strong></td>
        <td name="itemPrice">${price}</td>
        <td>${date}</td>
        <td><button class="btn btn-danger" onclick="removeItem('${idRow}');">Eliminar</button></td>
        </tr>
        `;

    document.getElementById('input').innerHTML += gasto;
    
    document.querySelector('#name').value = '';
    document.querySelector('#price').value = '';
    document.querySelector('#date').value = '';
}

function removeItem(itemID){
    document.getElementById(itemID).remove();
}

function getTotalPrice(){
    var cont = 0;
    var prices = Array();

    prices = document.getElementsByName('itemPrice');

    prices.forEach(i => {
        cont = cont + parseInt(i.innerHTML);
    });    

    document.getElementById('total').innerHTML  = '';
    
    const total = `<label><h4 class="text-danger"><strong>$  ${cont}   </strong></h4></label>`;

    document.getElementById('total').innerHTML += total;
}


const templateMenu = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Ver Todos'
            },
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

const templatewinMenu = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Add',
                accelerator: 'Ctrl + N',
                click() {

                }
            }
        ]
    }
];