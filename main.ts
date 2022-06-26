import { RSA } from './RSA';

// Para rodar o projeto, basta instalar e rodar:
// npm i
// npm start

function f() {
    // Escolher um número primo.
    const firstPrimeNumber = 41;

    // Escolher outro número primo.
    const secondPrimeNumber = 97;

    // Escolher uma frase a ser criptograda.
    const phrase = 'Criptografia é sensacional.';

    // Instância da classe gerada com os parâmetros informados acima.
    const cyphertext = new RSA(phrase, firstPrimeNumber, secondPrimeNumber).encrypt();
    console.log(`Texto criptografado: ${cyphertext}`);
}

f();
