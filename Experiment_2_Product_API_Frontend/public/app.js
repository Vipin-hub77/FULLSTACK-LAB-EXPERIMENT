const API="/api/products";
const form=document.getElementById("productForm");
const list=document.getElementById("productList");
const statusText=document.getElementById("status");
const message=document.getElementById("message");

function escapeHTML(value=""){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}

async function loadProducts(){
  list.textContent="Loading products…";
  try{
    const response=await fetch(API);
    if(!response.ok)throw new Error("Could not load products");
    const products=await response.json();
    statusText.textContent="API Connected";
    document.getElementById("count").textContent=products.length;
    list.innerHTML=products.length?products.map(p=>`
      <article class="product-card">
        <span class="id">PRODUCT ID: ${p.id}</span>
        <h3>${escapeHTML(p.name)}</h3>
        <p class="price">₹${Number(p.price).toLocaleString("en-IN")}</p>
        <p class="rating">★ ${Number(p.rating).toFixed(1)} / 5 rating</p>
      </article>`).join(""):'<p class="empty">No products available. Add a product above.</p>';
  }catch(error){statusText.textContent="API connection failed";list.textContent=error.message;}
}

form.addEventListener("submit",async event=>{
  event.preventDefault();
  const product={
    name:document.getElementById("name").value.trim(),
    price:Number(document.getElementById("price").value),
    rating:Number(document.getElementById("rating").value)
  };
  try{
    const response=await fetch(API,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(product)});
    const data=await response.json();
    if(!response.ok)throw new Error(data.message||"Could not add product");
    message.textContent=`Product "${data.name}" added successfully.`;
    form.reset();
    document.getElementById("rating").value=4;
    await loadProducts();
  }catch(error){message.textContent=error.message;}
});
document.getElementById("refresh").addEventListener("click",loadProducts);
loadProducts();
