// Atualizando os dados dos signos com preços e status de compra na Loja
window.SIGNS_DATA_STORE = { ...window.SIGNS_DATA };

Object.keys(window.SIGNS_DATA_STORE).forEach(key => {
    window.SIGNS_DATA_STORE[key].price = "R$ 37,00";
    window.SIGNS_DATA_STORE[key].isPurchased = key === 'aries' || key === 'escorpiao'; // Exemplo: alguns liberados para teste
});
