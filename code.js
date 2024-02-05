'use strict';

let app = document.getElementById('app');

let startbtn = document.getElementById('start-btn');

let prevtbtn = document.getElementById('prev-btn');

let nextbtn = document.getElementById('next-btn');

let pl_prevtbtn = document.getElementById('pl-prev-btn');

let pl_nextbtn = document.getElementById('pl-next-btn');

let game_layer = document.getElementById('game-layer');

let winner_h3 = document.getElementById('winner-h3');

let boxs = document.querySelector('.boxs');

for( let i = 0 ; i < 9 ; i++ ){

    boxs.innerHTML += `<div class="box" box-id="${i}" ></div>`;

}

let boxsDivs = document.querySelectorAll('.boxs .box');

let p1_h3 = document.getElementById('p1-h3');

let p2_h3 = document.getElementById('p2-h3');

let p1_sing_input = document.getElementById('p1-sing-input');

let p2_sing_input = document.getElementById('p2-sing-input');

let p1_color_input = document.getElementById('p1-color-input');

let p2_color_input = document.getElementById('p2-color-input');

let p1_bg_color_input = document.getElementById('p1-bg-color-input');

let p2_bg_color_input = document.getElementById('p2-bg-color-input');

let start_the_game_btn = document.getElementById('start-the-game-btn');

let replay_btn = document.getElementById('replay-btn');


let winSerials = ["012","345","678","036","147","258","048","246"];

let allWinSerialsProbs = [];

for(let s = 0 ; s < winSerials.length ; s++ ){

    let arr = generateStringPermutations(winSerials[s]);

    for( let ss = 0 ; ss < arr.length ; ss ++ ){

        allWinSerialsProbs.push(arr[ss]);

    }

}

startbtn.onclick = function(){
    document.querySelector('.card.active').classList.remove('active');
    document.querySelectorAll('.card')[1].classList.add('active');
}

prevtbtn.onclick = function(){
    document.querySelector('.card.active').classList.remove('active');
    document.querySelectorAll('.card')[0].classList.add('active');
}

nextbtn.onclick = function(){
    if(app.getAttribute('game-stat') == 'on'){
        document.querySelector('.card.active').classList.remove('active');
        document.querySelectorAll('.card')[2].classList.add('active');
    }else{
        alert('select an option !')
    }
}

pl_prevtbtn.onclick = function(){
    document.querySelector('.card.active').classList.remove('active');
    document.querySelectorAll('.card')[1].classList.add('active');
}

pl_nextbtn.onclick = function(){
    updatePlayersData();
    document.querySelector('.card.active').classList.remove('active');
    document.querySelectorAll('.card')[3].classList.add('active');
}

document.querySelectorAll('.player-span').forEach((e)=>{
    e.onclick = function(){

        app.setAttribute('game-stat','on');

        let playersType = e.getAttribute('p-type');

        app.setAttribute('game-players',playersType);

        if(playersType == 'pp'){
            p1_h3.innerHTML = 'Player 1';
            p2_h3.innerHTML = 'Player 2';
        }
        else if(playersType == 'pc'){
            p1_h3.innerHTML = 'Player';
            p2_h3.innerHTML = 'Computer';
        }else{
            p1_h3.innerHTML = 'Computer 1';
            p2_h3.innerHTML = 'Computer 2';
        }
        console.log(playersType);
        nextbtn.click();
    }
})

p1_sing_input.oninput = function(){
    let player_sing = this.value;
    app.setAttribute('p1-sing',player_sing);
}

p2_sing_input.oninput = function(){
    let player_sing = this.value;
    app.setAttribute('p2-sing',player_sing);
}

p1_color_input.oninput = function(){
    let player_color = this.value;
    app.setAttribute('p1-color',player_color);
}

p2_color_input.oninput = function(){
    let player_color = this.value;
    app.setAttribute('p2-color',player_color);
}

p1_bg_color_input.oninput = function(){
    let player_bg_color = this.value;
    app.setAttribute('p1-bg-color',player_bg_color);
}

p2_bg_color_input.oninput = function(){
    let player_bg_color = this.value;
    app.setAttribute('p2-bg-color',player_bg_color);
}

start_the_game_btn.onclick = function(){
    app.setAttribute('game-stat','on');
    pl_nextbtn.click();
}

// GAME FUNCTION 

let t = 0;

let p1_serial = "";
let p2_serial = "";

boxsDivs.forEach((e)=>{

    e.onclick = function(){

        let playersType = app.getAttribute('game-players');

        let clickedBoxsNum = document.querySelectorAll('.box.active').length;

        if( !this.classList.contains('active') && app.getAttribute('game-stat') == 'on' ){

            if( t%2 == 0 ){
                p1_serial += this.getAttribute('box-id');
            }else{
                p2_serial += this.getAttribute('box-id');
            }

            app.setAttribute('p1_serial',p1_serial);
            
            app.setAttribute('p2_serial',p2_serial);

            if( checkWinner(p1_serial) ){
                winner_h3.innerHTML = p1_h3.innerHTML + ' Win';
                p1_serial = p2_serial = "";
                app.setAttribute('game-stat','off');
                game_layer.classList.add('on');

            }

            if( checkWinner(p2_serial) ){
                winner_h3.innerHTML = p2_h3.innerHTML + ' Win';
                p1_serial = p2_serial = "";
                app.setAttribute('game-stat','off');
                game_layer.classList.add('on');
            }

            // CASES 

            switch(playersType){

                // Case 01 Player Vs Player
                case 'pp' : 
                ppfunction();
                break;

                // Case 02 Player Vs Computer
                case 'pc' : 
                pcfunction();
                break;

                // Case 03 Computer Vs Computer
                case 'cc' : 
                ccfunction();
                break;

            }

            let p1 = {
               
                name    : p1_h3.innerHTML,
                sing    : app.getAttribute('p1-sing'),
                color   : app.getAttribute('p1-color'),
                bgColor : app.getAttribute('p1-bg-color')
    
            };
    
            let p2 = {
                
                name    : p2_h3.innerHTML,
                sing    : app.getAttribute('p2-sing'),
                color   : app.getAttribute('p2-color'),
                bgColor : app.getAttribute('p2-bg-color')
    
            };
    
            let p_arr = [p1,p2];

            this.innerHTML   = p_arr[t%2].sing;
            this.style.color = p_arr[t%2].color; 
            this.style.background = p_arr[t%2].bgColor; 
           
            t++;

            this.classList.add('active');

        }else if( clickedBoxsNum == 9){
            winner_h3.innerHTML = 'Try Again';
            p1_serial = p2_serial = "";
            app.setAttribute('game-stat','off');
            game_layer.classList.add('on');
        }
        else{
            winner_h3.innerHTML = 'Try Again';
            p1_serial = p2_serial = "";
            app.setAttribute('game-stat','off');
            game_layer.classList.add('on');
        }

    }
});

function updatePlayersData(){

        app.setAttribute('p1-sing',p1_sing_input.value);
    
        app.setAttribute('p2-sing',p2_sing_input.value);
    
        app.setAttribute('p1-color',p1_color_input.value);

        app.setAttribute('p2-color',p2_color_input.value);
    
        app.setAttribute('p1-bg-color',p1_bg_color_input.value);

        app.setAttribute('p2-bg-color',p2_bg_color_input.value);

}



function generateStringPermutations(inputString) {
    const results = [];
    const usedChars = [];
  
    function permute(input) {
      const chars = input.split('');
  
      if (chars.length === inputString.length) {
        results.push(chars.join(''));
      } else {
        for (let i = 0; i < inputString.length; i++) {
          if (usedChars.includes(inputString[i])) {
            continue;
          }
          usedChars.push(inputString[i]);
          permute(input + inputString[i]);
          usedChars.pop();
        }
      }
    }
  
    permute('');
    return results;
}

replay_btn.onclick = function(){

    app.setAttribute('game-stat','on');
    app.removeAttribute('p1_serial');
    app.removeAttribute('p2_serial');
    
    for( let i = 0 ; i < 9 ; i++ ){

        boxsDivs[i].innerHTML = "";
        boxsDivs[i].removeAttribute("style");
        boxsDivs[i].classList.remove("active");
    
    }

    game_layer.classList.remove('on');

}

console.log(allWinSerialsProbs);

function ppfunction(){

}

function pcfunction(){

}

function ccfunction(){

}

//  ['012', '345', '678', '036', '147', '258', '048', '246']

function checkWinner(p_serial){

    for( let i = 0 ; i < winSerials.length ; i++ ){

         let c = 0;

         for( let ii = 0 ; ii < p_serial.length ; ii++ ){
            
            if( winSerials[i].indexOf(p_serial[ii]) !== -1 ){

                c++;

            }

         }
        
         if( c == 3 ){
            return true;
         }

    }

}

function showTurn(){

    

}