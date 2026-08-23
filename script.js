/* ================= EFEITO NAVBAR ================= */
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if(navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

/* ================= SCROLL SUAVE PARA LINKS ================= */
document.querySelectorAll('.scroll-link').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if(targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70, // Compensa a altura da navbar
                behavior: 'smooth'
            });
        }
    });
});

/* ================= ANIMAÇÕES SCROLL ================= */
const elementosAnimados = document.querySelectorAll('.anima-scroll');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('ativo');
        }
    });
}, { threshold: 0.1 });
elementosAnimados.forEach(el => observer.observe(el));

/* ================= TOAST (NOTIFICAÇÕES) ================= */
function mostrarToast(mensagem, tipo = 'sucesso') {
    const container = document.getElementById('toast-container');
    if(!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;
    toast.innerText = mensagem;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('mostrar'), 10);
    setTimeout(() => {
        toast.classList.remove('mostrar');
        setTimeout(() => toast.remove(), 400); 
    }, 3000);
}

/* ================= MODAL DE AGENDAMENTO (SOLUÇÃO IPHONE) ================= */
const modal = document.getElementById('agendamentoModal');
let horarioSelecionado = '';

function abrirModal() {
    if(modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Trava a tela de fundo
    }
    
    if(localStorage.getItem('clienteNome')) {
        document.getElementById('nome').value = localStorage.getItem('clienteNome');
    }
    if(localStorage.getItem('clienteTelefone')) {
        document.getElementById('telefone').value = localStorage.getItem('clienteTelefone');
    }
}

function fecharModal() {
    if(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Destrava a tela de fundo
    }
}

if(modal) {
    // Fecha ao CLICAR no fundo escuro (PC e Android)
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            fecharModal();
        }
    });

    // Fecha ao TOCAR no fundo escuro (A MÁGICA DO IPHONE)
    modal.addEventListener('touchstart', function(event) {
        if (event.target === modal) {
            fecharModal();
        }
    }, { passive: true });
}

/* ================= SELEÇÃO DE HORÁRIO ================= */
function selecionarHorario(botaoClicado) {
    const botoes = document.querySelectorAll('.btn-horario');
    botoes.forEach(btn => btn.classList.remove('selecionado'));
    botaoClicado.classList.add('selecionado');
    horarioSelecionado = botaoClicado.querySelector('.hora').innerText;
}

/* ================= CONFIRMAR AGENDAMENTO ================= */
function confirmarAgendamento() {
    const nome = document.getElementById('nome').value;
    const telefone = document.getElementById('telefone').value;
    const data = document.getElementById('data').value;
    const servico = document.getElementById('servico').value;

    if (!nome || !telefone) {
        mostrarToast('Por favor, preencha seu Nome e WhatsApp.', 'erro');
        return;
    }
    if (!servico) {
        mostrarToast('Por favor, selecione um Serviço.', 'erro');
        return;
    }
    if (!data) {
        mostrarToast('Por favor, escolha uma Data.', 'erro');
        return;
    }
    if (!horarioSelecionado) {
        mostrarToast('Por favor, selecione um Horário.', 'erro');
        return;
    }

    localStorage.setItem('clienteNome', nome);
    localStorage.setItem('clienteTelefone', telefone);

    const dataFormatada = data.split('-').reverse().join('/');
    
    const mensagem = `Olá, gostaria de agendar um horário!\n\n*Nome:* ${nome}\n*Telefone:* ${telefone}\n*Serviço:* ${servico}\n*Data:* ${dataFormatada}\n*Horário:* ${horarioSelecionado}`;
    
    const mensagemCodificada = encodeURIComponent(mensagem);
    const numeroWhatsApp = '5581991994219'; 
    const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;

    mostrarToast('✅ Tudo certo! Abrindo o WhatsApp...', 'sucesso');
    
    setTimeout(() => {
        window.open(linkWhatsApp, '_blank');
        fecharModal();
    }, 1500);
}