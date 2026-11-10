export default async function getItems(){
    const res = await fetch("https://dummyjson.com/products");
    const dataResponse = await res.json();
    const data =  dataResponse.products.map((product) => {
        return {
            id : product.id,
            title: product.title,
            price : product.price,
            quantity : product.stock,
            image : product.images[0]
        }
    })
    return data;
}
getItems()