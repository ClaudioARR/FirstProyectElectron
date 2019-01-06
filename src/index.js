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
    const date = document.querySelector('#date').value;

    const idRow = name + month;
    

    const gasto = `
        <tr class="table-danger" id="${idRow}">
        <td>${name}</td>
        <td id="itemPrice">${price}</td>
        <td>${date}</td>
        <td><button class="btn btn-danger" onclick="removeItem('${idRow}');">Eliminar</button></td>
        </tr>
        `;

    document.getElementById('input').innerHTML += gasto;
}

function removeItem(itemID){
    document.getElementById(itemID).remove();
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