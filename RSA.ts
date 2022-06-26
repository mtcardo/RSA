import Decimal from 'decimal.js';

export class RSA {
    constructor(private phrase: string, private firstPrimeNumber: number, private secondPrimeNumber: number) {
        console.log(`Sua frase: ${this.phrase}`);
        console.log(`Primeiro número primo: ${this.firstPrimeNumber}`);
        console.log(`Segundo número primo: ${this.secondPrimeNumber}`);
        console.log(`N: ${this.n}`);
        console.log(`Phi: ${this.phi}`);
        console.log(`Chave pública: (${this.publicKey}, ${this.n})`);
        console.log(`Chave privada: (${this.privateKey}, ${this.n})`);
    }

    private get n(): number {
        return new Decimal(this.firstPrimeNumber)
            .mul(this.secondPrimeNumber)
            .toNumber();
    }

    private get phi(): number {
        const x = new Decimal(this.firstPrimeNumber).minus(1);
        const y = new Decimal(this.secondPrimeNumber).minus(1);
        return x.mul(y).toNumber();
    }

    private get publicKey(): number | undefined {
        let e = 2;
        while (e < this.phi) {
            const areCoprime = this.areCoprime(this.phi, e);
            if (!areCoprime) {
                ++e;
                continue;
            }

            return e;
        }
    }

    private get privateKey(): number {
        let d = 0;
        while (true) {
            const result = d * this.publicKey!;
            if (result % this.phi !== 1) {
                ++d;
                continue;
            }

            return d;
        }
    };

    public encrypt = (): string => {
        const phrase = this.toCode(this.phrase);
        return this.splitAndApply(phrase, this.expMod, '/');
    };

    private areCoprime(p: number, q: number): boolean {
        return this.getGcd(p, q) === 1;
    }

    private getGcd = (x: number, y: number): number => {
        if (x === 0 || y === 0)
            return 0;

        if (x === y)
            return x;

        if (x > y)
            return this.getGcd(x - y, y);

        return this.getGcd(x, y - x);
    };

    private expMod = (charcode: string): string => {
        let result = 1;
        let pow = Number(charcode);
        let e1 = this.publicKey!;

        while (e1 !== 0) {
            const d = e1 % 2;
            if (d === 1)
                result = (result * pow) % this.n;

            e1 = Math.floor(e1 / 2);
            pow = (pow * pow) % this.n;
        }

        if (result < 0)
            result += this.n;

        return String(result);
    };

    private splitAndApply = (input: string, fn: (_input: string) => string, split = '', join = ''): string => {
        return input.split(split)
            .map(fn)
            .join(join);
    };

    private toCode = (text: string): string => {
        const fn = (char: string): string => char.charCodeAt(0).toString();
        return this.splitAndApply(text, fn, '', '/');
    };
}
