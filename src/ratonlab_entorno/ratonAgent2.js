const Agent = require('../core/Agent');

/**
 * Simple reflex agent. Search for an object whithin a labyrinth. 
 * If the object is found the agen take it.
 */
class CleanerAgent extends Agent {
    constructor(value) {
        super(value);
        //LEFT, UP, RIGHT, DOWN, CELL
        this.table = {
            "0,0,0,0,0": "UP",
            "0,0,0,1,0": "UP",
            "0,0,1,0,0": "UP",
            "0,0,1,1,0": "LEFT",
            "0,1,0,0,0": "LEFT",
            "0,1,0,1,0": "RIGHT",
            "0,1,1,0,0": "LEFT",
            "0,1,1,1,0": "LEFT",
            "1,0,0,0,0": "UP",
            "1,0,0,1,0": "RIGHT",
            "1,0,1,0,0": "DOWN",
            "1,0,1,1,0": "UP",
            "1,1,0,0,0": "RIGHT",
            "1,1,0,1,0": "RIGHT",
            "1,1,1,0,0": "DOWN",
            "default": "TAKE"
        };
    }

    /**
     * We override the send method. 
     * In this case, the state is just obtained as the join of the perceptions
     */
    setup(initialState = {}){
        this.initialState = initialState;
        this.record = {} // Será la memoria del agente
        this.position = initialState; // Posición actual del agente
        this.table = { // Se dejan las acciones básicas
            "0,0" : "LEFT",
            "1,0" : "UP",
            "2,0" : "RIGHT",
            "3,0" : "DOWN",
            "default": "TAKE"
        };
    }

    send() {
        /**
         * Se escoge la acción dependiendo del mínimo de visitas en las casillas
         */
        let min = 999;
        let dir = "default";
        for(let i=0;i<Object.keys(this.perception).length - 1;i++){
            // Buscamos las celdas libres en la percepción y obtenemos sus coordenadas
            if(this.perception[i] == 0){
                let coordenada = '';
                switch(i){
                    case 0:
                        coordenada = (this.position.x-1) + "," + this.position.y;
                        break;
                    case 1:
                        coordenada = this.position.x + "," + (this.position.y-1);
                        break;
                    case 2:
                        coordenada = (this.position.x+1) + "," + this.position.y;
                        break;
                    case 3:
                        coordenada = this.position.x + "," + (this.position.y+1);
                        break;
                    default:
                        break;
                }
                // Si ya se visitó la casilla, se evalúa el número mínimo
                if(this.record[coordenada]){
                    if(parseInt(this.record[coordenada]) < min){
                        min = parseInt(this.record[coordenada]);
                        dir = i + "," + this.perception[4]
                    }
                // Si la casilla no se ha visitado se escoge inmediatamente
                }else{
                    min = 0;
                    dir = i + "," + this.perception[4]
                    break;
                }
            }
        }

        let action = this.table[dir]
        if (action) { // escogemos la acción correspondiente
            var position_actual = this.position.x + ',' + this.position.y;
            if(this.record[position_actual]){
                this.record[position_actual] += 1;  
            }else{
                this.record[position_actual] = 1;
            }
            // actualizamos la posición del agente
            switch(action){
                case 'UP':
                    this.position['y'] = this.position['y'] - 1
                    break;
                case 'DOWN':
                    this.position['y'] = this.position['y'] + 1
                    break;
                case 'LEFT':
                    this.position['x'] = this.position['x'] - 1
                    break;
                case 'RIGHT':
                    this.position['x'] = this.position['x'] + 1
                    break;
                default:
                    break;
            }
            return action;

        } else {
            return this.table["default"];
        }

    }

}

module.exports = CleanerAgent;