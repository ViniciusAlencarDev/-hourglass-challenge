const generateHourglass = async (n, reverse = false, withAnimation = true) => {
    if(n < 20) {
        console.log('The number passed cannot be less than 20.');
        return;
    }
    if(n % 2 !== 0) {
        n += 1
        console.log(`The past number has been set to ${n}`);
    }
    /**
     * if you choose reverse and with animation, the reverse will not be considered
     */

    const data = getStructure(n)
    if(withAnimation && data.length > 0) {

        const higher = data.slice(0, data.length / 2)
        const bottom = data.slice(data.length / 2, data.length)

        const msPerItem = 2000;
        await startTimer(higher, bottom, data[0].length)

        async function startTimer(higher, bottom, counter) {
            console.clear();

            draw(data, reverse)

            let indexFilled = null;
            for(let i = 0; i < higher.length - 1; i++) {
                for(let j = 0; j < higher[i].length; j++) {
                    if(higher[i][j] === 1) {
                        indexFilled = [i, j]
                        break;
                    }
                }
                if(indexFilled) break;
            }
            if(indexFilled) {
                higher[indexFilled[0]][indexFilled[1]] = 0;

                let updated = false;
                let time = 0;
                for(let i = bottom.length - 1; i >= 0; i--) {
                    for(let j = bottom[i].length; j >= 0; j--) {
                        if(bottom[i][j] === 0) {
                            for(let x = 1; x < i; x++) {
                                const middleIndex = Math.floor(bottom[x].length / 2)
                                bottom[x][middleIndex] = 1;
                                console.clear()
                                draw(data, reverse)
                                if(time < msPerItem) {
                                    await sleep(100);
                                    time += 100;
                                }
                                bottom[x][middleIndex] = 0;
                            }
                            bottom[i][j] = 1;
                            updated = true;
                            break;
                        }
                    }
                    if(updated) break;
                }

                if(time < msPerItem) await sleep(msPerItem - time)
                startTimer(higher, bottom, counter - 1)
            }
        }
        
    } else
        draw(data, reverse)

    function draw(data, reverse) {
        if(data.length > 0) {
            const size = data[0].length;
            let dataDraw = '';

            dataDraw += Array.apply(null, new Array(size + 4)).map(_ => '#').join('') + '\n'
            for(let i = 0; i < data.length; i++) {
                dataDraw += '#';
                
                const spaces = Math.floor((size - data[i].length) / 2);

                dataDraw += Array.apply(null, new Array(spaces)).map(_ => ' ').join('')
                dataDraw += '#';
                dataDraw += Array.apply(null, new Array(data[i].length)).map((_, j) => data[i][j] === 1 ? '#': ' ').join('')
                dataDraw += '#';
                dataDraw += Array.apply(null, new Array(spaces)).map(_ => ' ').join('')

                dataDraw += '#';
                dataDraw += '\n';
            }
            dataDraw += Array.apply(null, new Array(size + 4)).map(_ => '#').join('') + '\n'

            console.log(reverse && !withAnimation ? dataDraw.split('\n').reverse().join('\n') : dataDraw);
        }
    }

    function getStructure(n) {
        let data = [];
        let higher = [];
        let bottom = [];
        for(let i = 1; i < (n - 2); i += 2) {
            const lineHigher = []
            const lineBottom = []
            for(let j = 0; j < (i - 1); j++) {
                lineHigher.push(1)
                lineBottom.push(0)
            }
            higher.push(lineHigher)
            bottom.push(lineBottom)
        }
        data = [...higher.reverse(), ...bottom]
        return data;
    }
}

const sleep = ms => new Promise(r => setTimeout(r, ms))

// const [_, __, n, reverse, withAnimation] = process.argv;
// generateHourglass(n, reverse, withAnimation)

generateHourglass(40, false, true)
