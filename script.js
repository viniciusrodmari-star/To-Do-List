let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
let dataAtual = new Date();

/* TOAST */
function toast(msg,tipo="ok"){
    const t=document.getElementById("toast");
    t.innerText=msg;

    t.style.background = tipo==="ok"?"green":
                         tipo==="erro"?"red":"orange";

    t.style.opacity=1;
    setTimeout(()=>t.style.opacity=0,2500);
}

/* ADICIONAR */
function adicionarTarefa(){
    const titulo=document.getElementById("titulo").value;
    const descricao=document.getElementById("descricao").value;
    const prioridade=document.getElementById("prioridade").value;
    const data=document.getElementById("data").value;

    if(!titulo || !data){
        toast("Preencha os campos obrigatórios","erro");
        return;
    }

    tarefas.push({titulo,descricao,prioridade,data,concluida:false});
    salvar();
    renderizar();
    toast("Tarefa criada","ok");
}

/* SALVAR */
function salvar(){
    localStorage.setItem("tarefas",JSON.stringify(tarefas));
}

/* TEMPO */
function tempo(data){
    const diff=new Date(data)-new Date();

    if(diff<0) return "Já passou";

    const min=Math.floor(diff/60000);
    if(min<60) return `Faltam ${min} min`;

    const h=Math.floor(min/60);
    if(h<24) return `Faltam ${h}h`;

    return `Faltam ${Math.floor(h/24)} dias`;
}

/* STATUS */
function status(data){
    const diff=new Date(data)-new Date();
    if(diff<0) return "vencida";
    if(diff<3600000) return "proxima";
    return "";
}

/* RENDER LISTA */
function renderizar(){
    lista.innerHTML="";

    tarefas.forEach((t,i)=>{
        const li=document.createElement("li");

        li.className=`${t.prioridade} ${status(t.data)} ${t.concluida?"concluida":""}`;

        li.innerHTML=`
        <b>${t.titulo}</b><br>
        <small>${t.descricao}</small><br>
        <small>${tempo(t.data)}</small><br>
        <button onclick="toggle(${i})">✔</button>
        <button onclick="remover(${i})">🗑</button>
        `;

        lista.appendChild(li);
    });

    calendario();
}

/* AÇÕES */
function toggle(i){
    tarefas[i].concluida=!tarefas[i].concluida;
    salvar();
    renderizar();
    toast("Tarefa atualizada","ok");
}

function remover(i){
    tarefas.splice(i,1);
    salvar();
    renderizar();
    toast("Tarefa removida","aviso");
}

/* CALENDÁRIO */
function calendario(){
    dias.innerHTML="";

    const mes=dataAtual.getMonth();
    const ano=dataAtual.getFullYear();

    mesAno.innerText=dataAtual.toLocaleString("pt-BR",{month:"long",year:"numeric"});

    const total=new Date(ano,mes+1,0).getDate();

    for(let d=1; d<=total; d++){
        const dataStr=`${ano}-${String(mes+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;

        const tarefasDia = tarefas.filter(t=>t.data.startsWith(dataStr));

        const div=document.createElement("div");
        div.className="dia";

        const hoje=new Date();
        if(d===hoje.getDate() && mes===hoje.getMonth()) div.classList.add("hoje");

        div.innerHTML=`<b>${d}</b>`;

        tarefasDia.forEach(t=>{
            const hora=new Date(t.data).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});
            div.innerHTML+=`<div class="evento">${hora} ${t.titulo}</div>`;
        });

        div.onclick=()=>abrirModal(dataStr);

        dias.appendChild(div);
    }
}

/* MODAL */
function abrirModal(data){
    modal.style.display="block";
    tarefasDia.innerHTML="<h3>Agenda do dia</h3>";

    tarefas
    .filter(t=>t.data.startsWith(data))
    .sort((a,b)=> new Date(a.data)-new Date(b.data))
    .forEach(t=>{
        const hora=new Date(t.data).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});

        tarefasDia.innerHTML+=`
        <p>
        <b>${hora}</b> - ${t.titulo}<br>
        <small>${t.descricao}</small><br>
        <small>Prioridade: ${t.prioridade}</small><br>
        <small>${tempo(t.data)}</small>
        </p>`;
    });
}

function fecharModal(){
    modal.style.display="none";
}

/* NAV */
function mesAnterior(){
    dataAtual.setMonth(dataAtual.getMonth()-1);
    calendario();
}
function proximoMes(){
    dataAtual.setMonth(dataAtual.getMonth()+1);
    calendario();
}

renderizar();