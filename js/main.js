document.addEventListener('DOMContentLoaded', () => {
    fetchData();
});

const fetchData = async() => {
    try {
        const res = await fetch('api.json');
        const data = await res.json();
        pintarProductos(data);
        detectarBotones(data);
    } catch (error) {

    };
};

const contenedorProductos = document.querySelector('#contenedor-Productos');

const pintarProductos = (data) => {

    const template = document.querySelector('#template-Productos').content;
    const fragment = document.createDocumentFragment();

    data.forEach(producto => {

        template.querySelector('h6').textContent = producto.nproducto;
        template.querySelector('img').setAttribute('src', producto.thumbnailUrl);
        template.querySelector('h5').textContent = producto.title;
        template.querySelector('p span').textContent = producto.precio;
        template.querySelector('button').dataset.id = producto.id;

        const clone = template.cloneNode(true);
        fragment.appendChild(clone);
    });

    contenedorProductos.appendChild(fragment);
};

const detectarBotones = (data) => {
    
    const botones = document.querySelectorAll('.card button');
    
    botones.forEach(btn => {
        btn.addEventListener('click', () => {

            const producto = data.find(item => item.id === parseInt(btn.dataset.id));
            producto.cantidad = 1;

            if(carritoObjeto.hasOwnProperty(producto.id)){
                producto.cantidad = carritoObjeto[producto.id].cantidad + 1;
            };

            carritoObjeto[producto.id] = { ...producto };
            pintarCarrito()
        });
    });
};

const items = document.querySelector('#items');
let carritoObjeto = {};

const pintarCarrito = () => {

    items.innerHTML = '';    

    const template = document.querySelector("#template-carrito").content 
    const fragment = document.createDocumentFragment();

    Object.values(carritoObjeto).forEach(producto => {
        
        template.querySelector('th').textContent = producto.id;
        template.querySelectorAll('td')[0].textContent = producto.title; 
        template.querySelectorAll('td')[1].textContent = producto.cantidad;
        template.querySelector('span').textContent = producto.precio * producto.cantidad;
        template.querySelector('.btn-success').dataset.id = producto.id;
        template.querySelector('.btn-danger').dataset.id = producto.id;

        const clone = template.cloneNode(true);
        fragment.appendChild(clone);
    });

    items.appendChild(fragment);
    pintarFooter ()
    accionBotones ()

};

const footer = document.querySelector('#footer-carrito');
const pintarFooter = () => {

    footer.innerHTML = ''; 

    if(Object.keys(carritoObjeto).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Carro Vacío 🛒😭</th>
        `;
        return;
    };

    const template = document.querySelector('#template-footer').content;
    const fragment = document.createDocumentFragment();
    const nCantidad = Object.values(carritoObjeto).reduce((acc, {cantidad}) => acc + cantidad, 0);
    const nPrecio = Object.values(carritoObjeto).reduce((acc, {cantidad, precio}) => acc + cantidad * precio , 0); 

    template.querySelectorAll('td')[0].textContent = nCantidad;
    template.querySelector('span').textContent = nPrecio;

    const clone = template.cloneNode(true);
    fragment.appendChild(clone);
    footer.appendChild(fragment);

    const boton = document.querySelector('#vaciar-carrito');
    boton.addEventListener('click', () => {
        carritoObjeto = {};
        pintarCarrito();
    });
};

const accionBotones = () => {

    const botonesAgregar = document.querySelectorAll('#items .btn-success');
    const botonesEliminar = document.querySelectorAll('#items .btn-danger');

    botonesAgregar.forEach(btn => {
        btn.addEventListener('click', () => {

            const producto = carritoObjeto[btn.dataset.id];
            producto.cantidad ++;
            carritoObjeto[btn.dataset.id] = {...producto};
            pintarCarrito(); 

        });

    });

    botonesEliminar.forEach(btn => {
        btn.addEventListener('click', () => {

            const producto = carritoObjeto[btn.dataset.id];
            producto.cantidad --;
            if(producto.cantidad === 0) {
                delete carritoObjeto[btn.dataset.id];
            } else {

            };

            pintarCarrito();

        });
    });

};
