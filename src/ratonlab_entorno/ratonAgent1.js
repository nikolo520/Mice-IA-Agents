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
        this.action = "TAKE"
        // Se toma la acción inicial como take para que tome la percepción real al iniciar
    }

    send() {
        // Busca la acción en la tabla de decisiones y guarda la acción ejecutada
        let viewKey = this.perception.join();
        if (this.table[viewKey]) {
            this.action = this.table[viewKey];
            return this.table[viewKey];
        } else {
            this.action = this.table["default"];
            return this.table["default"];
        }
    }

    receive(inputs) {
        this.perception = inputs;
        /** 
         * Modificamos la percepción del agenta para que "tape"
         * la posición desde donde vino
         * **/
        switch(this.action){
            case 'RIGHT':
                this.perception[0] = 1;
                break;
            case 'DOWN':
                this.perception[1] = 1;
                break;
            case 'LEFT':
                this.perception[2] = 1;
                break;
            case 'UP':
                this.perception[3] = 1;
                break;
            default:
                break;
        }
    }
}

module.exports = CleanerAgent;