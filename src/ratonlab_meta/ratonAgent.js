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

    setup(state0)
    {
        this.x = state0.raton.x;
        this.y = state0.raton.y;
        this.queso0 = state0.queso;

        this.record = {};
        //this.record[this.x + ',' + this.y] = 1;
    }

    /**
     * We override the send method. 
     * In this case, the state is just obtained as the join of the perceptions
     */
    send()
    {
        //this.perception = [LEFT, UP, DOWN, RIGTH, SMELL, ratonx, ratony, qx, qy]
  
        var datos = this.perception;
        var posibles = new Array();
        var result_final = new Array();

        for(var i = 0;i < Object.keys(datos).length - 5;i++)
        {
            if(datos[i] == 0)
            {
                switch(i)
                {
                    case 0:
                    {
                        posibles.push("LEFT");

                        break;
                    }

                    case 1:
                    {
                        posibles.push("UP");

                        break;
                    }

                    case 2:
                    {
                        posibles.push("RIGHT");

                        break;
                    }

                    case 3:
                    {
                        posibles.push("DOWN");

                        break;
                    }
                }
            }
        }

        console.log(posibles);

        var indice = undefined;
        var cantidad = undefined;

        for(var i = 0;i < posibles.length;i++)
        {
            var x = datos[5];
            var y = datos[6];

            var position_actual = 
            {
                "x": x,
                "y": y
            };

            switch(posibles[i])
            {
                case "LEFT":
                {
                    position_actual.x -= 1;

                    break;
                }

                case "RIGHT":
                {
                    position_actual.x += 1;

                    break;
                }

                case "UP":
                {
                    position_actual.y -= 1;

                    break;
                }

                case "DOWN":
                {
                    position_actual.y += 1;

                    break;
                }

                default:
                {
                    break;
                }
            }

            var position_siguiente = position_actual.x + ',' + position_actual.y;

            if(this.record[position_siguiente])
            {
                if(cantidad != undefined)
                {
                    if(this.record[position_siguiente] <= cantidad)
                    {
                        if(this.record[position_siguiente] < cantidad)
                        {
                            result_final = [i];
                            cantidad = this.record[position_siguiente];
                        }
                        else
                        {
                            result_final.push(i);
                        }
                    }
                }
                else
                {
                    result_final = [i];
                    cantidad = this.record[position_siguiente];
                } 
            }
            else
            {
                if(cantidad == 0)
                {
                    result_final.push(i);
                }
                else
                {
                    result_final = [i];
                    cantidad = 0;
                }
            }
        }

        console.log(result_final);

        if(result_final.length > 1)
        {
            var sub_indice = undefined;
            var distancia = undefined;
            var posicion_queso = 
            {
               "x": datos[7],
                "y": datos[8] 
            };

            for(var i = 0;i < result_final.length;i++)
            {
                var x = datos[5];
                var y = datos[6];

                var position_actual = 
                {
                    "x": x,
                    "y": y
                };

                switch(posibles[result_final[i]])
                {
                    case "LEFT":
                    {
                        position_actual.x -= 1;

                        break;
                    }

                    case "RIGHT":
                    {
                        position_actual.x += 1;

                        break;
                    }

                    case "UP":
                    {
                        position_actual.y -= 1;

                        break;
                    }

                    case "DOWN":
                    {
                        position_actual.y += 1;

                        break;
                    }

                    default:
                    {
                        break;
                    }
                }

                var nueva_distancia = Math.sqrt((Math.pow((posicion_queso.x - position_actual.y), 2)) + (Math.pow((posicion_queso.y - position_actual.y), 2)));

                if(i == 0)
                {
                    sub_indice = result_final[i];
                    distancia = nueva_distancia;
                }
                else
                {
                    if(nueva_distancia < distancia)
                    {
                        sub_indice = result_final[i];
                        distancia = nueva_distancia;
                    }
                }
            }

            indice = sub_indice;
        }
        else
        {
            indice = result_final[0];
        }

        console.log(indice);

        for(var i = 0;i < posibles.length;i++)
        {
            if(i != indice)
            {
                switch(posibles[i])
                {
                    case "LEFT":
                    {
                       datos[0] = 1;

                        break;
                    }

                    case "RIGHT":
                    {
                        datos[2] = 1;

                        break;
                    }

                    case "UP":
                    {
                        datos[1] = 1;

                        break;
                    }

                    case "DOWN":
                    {
                        datos[3] = 1;

                        break;
                    }

                    default:
                    {
                        break;
                    }
                }
            }
        }        

        let viewKey = datos[0] + ',' + datos[1] + ',' + datos[2] + ',' + datos[3] + ',' + datos[4];

        if(this.table[viewKey])
        {
            this.action = this.table[viewKey];

            var position_actual = datos[5] + ',' + datos[6];

            if(this.record[position_actual])
            {
                this.record[position_actual] += 1;  
            }
            else
            {
                this.record[position_actual] = 1;
            }

            return this.table[viewKey];
        }
        else
        {
            this.action = this.table["default"];

            //console.log(this.record);

            return this.table["default"];
        }
    }

}

module.exports = CleanerAgent;