const API="/api/products";
const form=document.getElementById("productForm");
const list=document.getElementById("products");
const message=document.getElementById("message");
let editId=null;

async function api(url,options={}){
  const response=await fetch(url,{headers:{"Content-Type":"application/json"},...options});
  const data=await response.json();
  if(!response.ok) throw new Error(data.message||"Request failed");
  return data;
}
function safe(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
async function load(){
  try{
    const products=await api(API);
    list.innerHTML=products.length?products.map(p=>`
      <article class="item"><div><strong>#${p.id} ${safe(p.name)}</strong>
      <p>Price: ₹${p.price}</p><p>${safe(p.description)}</p></div>
      <div><button data-action="edit" data-id="${p.id}">Edit</button>
      <button class="danger" data-action="delete" data-id="${p.id}">Delete</button></div></article>`).join(""):"<p>No products available.</p>";
  }catch(e){list.textContent=e.message;}
}
form.addEventListener("submit",async e=>{
  e.preventDefault();
  const body={name:document.getElementById("name").value,price:document.getElementById("price").value,description:document.getElementById("description").value};
  try{
    await api(editId?`${API}/${editId}`:API,{method:editId?"PUT":"POST",body:JSON.stringify(body)});
    message.textContent=editId?"Product updated.":"Product created.";
    reset();load();
  }catch(err){message.textContent=err.message;}
});
list.addEventListener("click",async e=>{
  const b=e.target.closest("button[data-action]");if(!b)return;
  const id=b.dataset.id;
  try{
    if(b.dataset.action==="edit"){
      const p=await api(`${API}/${id}`);
      document.getElementById("name").value=p.name;
      document.getElementById("price").value=p.price;
      document.getElementById("description").value=p.description;
      editId=id;document.getElementById("formTitle").textContent="Edit Product";
      document.getElementById("saveBtn").textContent="Save Changes";
      document.getElementById("cancelBtn").hidden=false;
    }else if(confirm("Delete this product?")){
      await api(`${API}/${id}`,{method:"DELETE"});message.textContent="Product deleted.";load();
    }
  }catch(err){message.textContent=err.message;}
});
function reset(){form.reset();editId=null;document.getElementById("formTitle").textContent="Add Product";document.getElementById("saveBtn").textContent="Add Product";document.getElementById("cancelBtn").hidden=true;}
document.getElementById("cancelBtn").addEventListener("click",reset);
load();
