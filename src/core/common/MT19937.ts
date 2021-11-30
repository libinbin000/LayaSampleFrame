export class MT19937{
    private index:number;
    private MT:Array<number> = [];
    
    constructor(seed) {
        this.srand(seed);
    }

    srand(seed){
        this.index = 0;
        this.MT[0] = seed;
        for(let i = 1; i < 624; i++){
            let t = 1812433253 * (this.MT[i - 1] ^ (this.MT[i - 1] >>> 30)) + i;
            this.MT[i] = t & 0xffffffff;
        }
    }

    generate(){
        for(let i = 0; i < 624; i++){
            let y = (this.MT[i] & 0x80000000) + (this.MT[(i + 1) % 624] & 0x7fffffff);
            this.MT[i] = this.MT[(i + 397) % 624] ^ (y >>> 1);
            if (y & 1)
                this.MT[i] ^= 2567483615;
        }
    }

    next()
    {
        if(this.index == 0)
            this.generate();
        let y = this.MT[this.index];
        y = y ^ (y >>> 11);                 //y右移11个bit
        y = y ^ ((y << 7) & 2636928640);    //y左移7个bit与2636928640相与，再与y进行异或
        y = y ^ ((y << 15) & 4022730752);   //y左移15个bit与4022730752相与，再与y进行异或
        y = y ^ (y >>> 18);                 //y右移18个bit再与y进行异或
        this.index = (this.index + 1) % 624;
        return y;
    }
}