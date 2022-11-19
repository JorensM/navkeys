/* ---Options schema---
    mode: string | "auto", "manual", "mixed"
*/




//---Base class---//
class NavKeys {


    //---Constants---//
    constants = {
        mode: {
            auto: "auto",
            manual: "manual",
            mixed: "mixed"
        },
        key_code: {
            left: 37,
            up: 38,
            right: 39,
            down: 40
        },
        direction: {
            left: "left",
            up: "up",
            right: "right",
            down: "down"
        }
    }

    default_options = {
        mode: this.constants.mode.auto,
        autoElements: ["a", "button", "p"]
    }

    //---Constructor---//
    constructor(options = null){
        options = {...this.default_options, ...options}

        //Add nav_elements for auto/mixed modes
        if(options.mode === this.constants.mode.auto || options.mode === this.constants.mode.mixed){
            if(options.autoElements === undefined || options.autoElements === null || !Array.isArray(options.autoElements)){
                throw new Error("Invalid autoElements option!");
            }else{
                //Add elements to nav_elements that match the options.autoElements queries
                options.autoElements.forEach(query => {
                    //console.log("query: " + query);
                    const elements = document.querySelectorAll(query);
                    elements.forEach(item => {
                        //console.log(item);
                        this.nav_elements.push(item);
                    })
                })
                //Remove duplicates
                this.nav_elements = this.arr_remove_duplicates(this.nav_elements);
            }
        }//Add nav_elements for manual mode
        else if(options.mode === this.constants.mode.manual){

        }
        else{
            throw new Error("Invalid NavKeys mode!");
        }

        window.addEventListener("keydown", event => {
            if( event.keyCode === this.constants.key_code.up ||
                event.keyCode === this.constants.key_code.down ||
                event.keyCode === this.constants.key_code.right ||
                event.keyCode === this.constants.key_code.left ){
                    const direction = this.keycodeToDirection(event.keyCode);
                    console.log("Arrow key pressed: " + direction);
                    this.navigate(direction);
            }
        })
    }

    //Navigate to another element
    //Direction = "up", "down", "left", "right"
    navigate(direction){

        if(this.current_element === null){
            this.current_element = this.getTompostElement(this.nav_elements);
        }
        console.log(this.current_element);

        /*The area in which the navigation will occur
            (if direction = up, then above the current element, 
            if direction = right, then to the right of current element, etc.)
        */
        const nav_area = {};
        //Viewport width and height
        const vw = document.documentElement.clientWidth;
        const vh = document.documentElement.clientHeight;
        //Current elements bounding box
        const current_rect = this.current_element.getBoundingClientRect();

        //Set nav_area
        if(direction === this.constants.direction.up){
            nav_area.x = 0;
            nav_area.y = 0;
            nav_area.width = vw;
            nav_area.height = current_rect.y;
        }else if(direction === this.constants.direction.down){
            nav_area.x = 0;
            nav_area.y = current_rect.bottom;
            nav_area.width = vw;
            nav_area.height = vh - current_rect.bottom;
        }else if(direction === this.constants.direction.left){
            nav_area.x = 0;
            nav_area.y = 0;
            nav_area.width = current_rect.x;
            nav_area.height = vh;
        }else if(direction === this.constants.direction.right){
            nav_area.x = current_rect.right;
            nav_area.y = 0;
            nav_area.width = vw - current_rect.right;
            nav_area.height = vh;
        }

        console.log(nav_area);
    }

    //Remove duplicates in an array
    arr_remove_duplicates(arr){
        const uniq = [...new Set(arr)];
        return uniq;
    }

    //Convert arrow key keycode to direction in string format
    keycodeToDirection(keycode){
        switch(keycode){
            case this.constants.key_code.up:
                return this.constants.direction.up;
            case this.constants.key_code.down:
                return this.constants.direction.down;
            case this.constants.key_code.left:
                return this.constants.direction.left;
            case this.constants.key_code.right:
                return this.constants.direction.right;
        }
    }

    //Get highest nav_element from an array of elements
    getTompostElement(elements){
        console.log("elements");
        console.log(elements);
        if(elements.length < 1){
            throw new Error("Nav elements count = 0");
        }
        let highest_element = elements[0];
        elements.forEach(element => {
            if(element.getBoundingClientRect().y < highest_element.getBoundingClientRect().y){
                highest_element = element;
            }
        })
        return highest_element;
    }

    //Get leftmost nav_element from an array of elements
    getLeftmostElement(elements){
        if(elements.length < 1){
            throw new Error("Nav elements count = 0");
        }
        leftmost_element = elements[0];
        this.elements.forEach(element => {
            if(element.getBoundingClientRect().x < highest_element.getBoundingClientRect().x){
                leftmost_element = element;
            }
        })
        return leftmost_element;
    }

    getElementsInArea(elements, area){
        let output = [];
        elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            
        })
    }

    overlaps(a, b) {
        // no horizontal overlap
        if (a.x1 >= b.x2 || b.x1 >= a.x2) return false;
    
        // no vertical overlap
        if (a.y1 >= b.y2 || b.y1 >= a.y2) return false;
    
        return true;
    }

    //Get leftmost + topmost element from an array of elements
    // getFirstElement(elements){
    //     elements = this.getTompostElement(elements);
    //     elements = this.getL
    // }

    //Elements that are navigatable
    nav_elements = [];
    //Currently focused element
    current_element = null;
}