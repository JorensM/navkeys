var NavKeys = (function () {
    'use strict';

    let navkeys_instance = null;


    //---Base class---//
    class NavKeys {


        //---Constructor---//
        constructor(options = null){
            if(!this.#is_browser()){
                console.log("NavKeys is intended for browsers, not servers!");
            }

            this.#allow_single_instance();

            //Check options type
            if(typeof options !== "object" || options === null){
                this.#error("Options parameter must be of type object or null!");
            }

            options = {...this.#default_options, ...options};

            this.#validate_options(options);

            this.#options = options;

            if(options.comboKey){
                this.#is_combo_key_down = false;
            }else {
                this.#is_combo_key_down = true;
            }

            //Add nav_elements for auto/mixed modes
            if(options.mode === this.#constants.mode.auto || options.mode === this.#constants.mode.mixed){
                if(options.autoElements === undefined || options.autoElements === null || !Array.isArray(options.autoElements)){
                    this.#error("Invalid autoElement option!");
                }else {
                    //Add elements to nav_elements that match the options.autoElements queries
                    options.autoElements.forEach(query => {
                        const elements = document.querySelectorAll(query);
                        elements.forEach(item => {
                            this.#nav_elements.push(item);
                        });
                    });
                    //Remove duplicates
                    this.#nav_elements = this.#arr_remove_duplicates(this.#nav_elements);
                    if(!options.useClass){
                        this.#setTabIndex(this.#nav_elements);
                    }
                    
                }
            }//Add nav_elements for manual mode
            else if(options.mode === this.#constants.mode.manual);
            else {
                throw new Error("Invalid NavKeys mode!");
            }

            window.addEventListener("keydown", event => {
                //Prevent scrolling if up/down arrow keys are being used
                if((event.keyCode === this.#constants.key_code.up && this.#isKeySet(this.#constants.key_code.up)) ||
                    event.keyCode === this.#constants.key_code.down && this.#isKeySet(this.#constants.key_code.down)){
                        event.preventDefault();
                }
                //console.log(this.#is_combo_key_down);
                if( (event.keyCode === this.#options.keys.up ||
                    event.keyCode === this.#options.keys.down ||
                    event.keyCode === this.#options.keys.right ||
                    event.keyCode === this.#options.keys.left) && this.#is_combo_key_down ){
                        const direction = this.#keycodeToDirection(event.keyCode);
                        this.navigate(direction);
                }
                //Check if combo key is down, and set the according variable
                if(this.#options.comboKey && event.keyCode === this.#options.comboKey){
                    this.#is_combo_key_down = true;
                }

                //Unfocus key down, blur element and set current_element to null
                if(this.#options.unfocusKey && event.keyCode === this.#options.unfocusKey && this.#current_element !== null){
                    this.#current_element.blur();
                    if(this.#options.useClass){
                        this.#current_element.classList.remove(this.#options.useClass);
                    }
                    this.#current_element = null;
                }
            });

            window.addEventListener("keyup", event => {
                //Check if combo key is released, and set the according variable
                if(this.#options.comboKey && event.keyCode === this.#options.comboKey){
                    this.#is_combo_key_down = false;
                }
            });
        }

        //---Public---//

        //Navigate to another element
        //direction = "up", "down", "left", "right"
        navigate(direction){

            //Validators
            this.#validateDirection(direction);

            if(this.#current_element === null){
                this.#current_element = this.#getFirstElement(this.#nav_elements);
                console.log("first element: ");
                console.log(this.#current_element);
                this.focus(this.#current_element);
                return;
            }

            /*The area in which the navigation will occur
                (if direction = up, then above the current element, 
                if direction = right, then to the right of current element, etc.)
            */
            let nav_area = this.#calculateNavArea(this.#current_element, direction);

            const target_elements = this.#getElementsInsideArea(this.#nav_elements, nav_area);
            if(target_elements.length > 0){
                const navigate_to = this.#getClosestElementCenter(this.#current_element, target_elements);
                console.log("navigate to: ");
                console.log(navigate_to);
                this.focus(navigate_to);
            }
        }

        //Unfocus current element
        //unfocusCurrentElement(){


        //     element.unfocus();
        // }

        //Adds specified element to nav_elements.
        addNavElement(element){

            this.#validateDomEntity(element);

            if(!this.#nav_elements.includes(element)){
                this.#nav_elements.push(element);
            }else {
                this.#warn("Could not add element to nav_elements - element already added");
            }
        }

        //Focus element
        //element - HTMLelement to focus
        focus(element){
            //Validation
            this.#validateDomEntity(element);

            //Unfocus previous element(if set)
            if(this.#current_element !== null){
                this.#current_element.blur();
                
                //Remove focus class from previous element
                if(this.#options.useClass){
                    this.#current_element.classList.remove(this.#options.useClass);
                }
            }
            

            //Focus new element
            element.focus();
            this.#current_element = element;
            //Add focus class to new element
            if(this.#options.useClass){
                this.#current_element.classList.add(this.#options.useClass);
            }
        }

        //---Public END---//

        //---Checkers---//

        //Check if script is running in browser or server
        #is_browser(){
            if(typeof window !== "undefined"){
                return true;
            }
            return false;   
        }

        //Check if specified css selector is valid
        #isSelectorValid(selector){
            if(typeof selector !== "string"){
                this.#error("Parameter must be of type string!");
            }
            try{
                this.#queryCheck(selector);
            }catch{
                return false;
            }
            return true;
        }
        #queryCheck(selector){
            return document.createDocumentFragment().querySelector(selector);
        }

        //Check if given keycode is used as a key in options
        #isKeySet(keycode){

            const keys = this.#options.keys;

            return [keys.up, keys.down, keys.left, keys.right].includes(keycode);
        }

        //Check if entity is a DOM element
        #isDomEntity(entity) {
            if(typeof entity  === 'object' && entity.nodeType !== undefined){
               return true;
            }
            else {
               return false;
            }
        }

        //Check if array contains only DOM elements
        #areDomEntities(array){
            if(!Array.isArray(array)){
                this.#error("Parameter must be an array!");
            }
            let all_entities = true;
            array.forEach(entity => {
                if(!this.#isDomEntity(entity)){
                    all_entities = false;
                }
            });
            return all_entities;
        }

        //---Checkers END---//

        //---Getters---//

        //Get closest of a number of elements to a single target element. Calculating from element's center position
        //from_element - HTML element from which to calculate
        //to_elements - array of HTML element to which to compare
        #getClosestElementCenter(from_element, to_elements){

            //Validation
            this.#validateDomEntity(from_element);
            this.#validateDomEntities(to_elements);

            let closest = to_elements[0];
            let closest_distance = this.#distanceBetweenElementsCenter(from_element, to_elements[0]);
            to_elements.forEach(to_element => {
                const compare_distance = this.#distanceBetweenElementsCenter(from_element, to_element);
                console.log("to_element: ");
                console.log(to_element);
                console.log(compare_distance);
                if(compare_distance < closest_distance){
                    closest_distance = compare_distance;
                    closest = to_element;
                }
            });
            return closest;
        }

        //Get highest nav_element from an array of elements
        #getTopmostElements(elements){

            this.#validateDomEntities(elements);
            if(elements.length < 1){
                throw new Error("Nav elements count = 0");
            }
            let highest_element = elements[0];
            elements.forEach(element => {
                if(element.getBoundingClientRect().y < highest_element.getBoundingClientRect().y){
                    highest_element = element;
                }
            });
            let highest_elements = [];
            elements.forEach(element => {
                if(element.getBoundingClientRect().y === highest_element.getBoundingClientRect().y){
                    highest_elements.push(element);
                }
            });
            //if(highest_elements.length > 1){
                //return highest_elements;
            //}
            return highest_elements;
        }

        //Get leftmost nav_element from an array of elements
        #getLeftmostElements(elements){

            this.#validateDomEntities(elements);

            if(elements.length < 1){
                throw new Error("Nav elements count = 0");
            }
            let leftmost_element = elements[0];
            console.log("elems: ");
            console.log(elements);
            elements.forEach(element => {
                if(element.getBoundingClientRect().x < leftmost_element.getBoundingClientRect().x){
                    leftmost_element = element;
                }
            });

            let leftmost_elements = [];
            elements.forEach(element => {
                if(element.getBoundingClientRect().x === leftmost_element.getBoundingClientRect().x){
                    leftmost_elements.push(element);
                }
            });
            return leftmost_elements;
        }

        //Get leftmost + topmost element from an array of elements
        #getFirstElement(elements){
            elements = this.#getTopmostElements(elements);
            console.log("topmost: ");
            console.log(elements);
           
            elements = this.#getLeftmostElements(elements);
            console.log("leftmost: ");
            console.log(elements);
            return elements[0];
        }

        //Get elements that are contained inside an area
        //elements - HTML elements
        //area - {x, y, width, height}
        //Returns array of filtered elements
        #getElementsInsideArea(elements, area){

            //Validation
            this.#validateDomEntities(elements);
            this.#validateArea(area);

            let output = [];
            elements.forEach(element => {
                const rect = element.getBoundingClientRect();
                if( 
                    rect.left >= area.x && 
                    rect.right <= (area.x + area.width) &&
                    rect.top >= area.y &&
                    rect.bottom <= area.y + area.height
                ){
                    output.push(element);
                }
            });
            return output;
        }

        //Get center position of element's client rect
        //Returns {x, y}
        #getElementCenterPosition(element){

            //Validation
            this.#validateDomEntity(element);

            const rect = element.getBoundingClientRect();
            const x = rect.x + (rect.width / 2);
            const y = rect.y + (rect.height / 2);

            return {x, y};
        }

        //---Getters END---//

        //---Setters---//

        //Set tab index attribute for elements.
        //Necessary to make elements such as 'p' focusable
        #setTabIndex(elements){
            console.log(elements);
            if(!Array.isArray(elements)){
                this.#error("Parameter must be an array!");
            }
            if(!this.#areDomEntities(elements)){
                this.#error("Array must only contain DOM elements!");
            }
            elements.forEach(element => {
                const current_tab_index = +element.getAttribute("tabindex");
                console.log("tabindex:");
                console.log(current_tab_index);
                //Only set tab index if it hasn't already been set
                if(current_tab_index === 0){
                    element.setAttribute("tabindex", "-1");
                }
            });
        }

        //---Setters END---//

        //---Validators---//

        //Validates options object
        #validate_options(options){
            //Mode validation
            if(typeof options.mode !== "string"){
                this.#error("'mode' option must be of type string!");
            }
            if(!["auto", "manual", "mixed"].includes(options.mode)){
                this.#error("'mode' option accepts the following values: 'auto', 'manual', 'mixed'");
            }
            if(typeof options.keys !== "object" || options.keys === null){
                this.#error("'keys' option must be an object containing the following properties: up, down, left right");
            }
            if( typeof options.keys.up !== "number" ||
                typeof options.keys.down !== "number" ||
                typeof options.keys.left !== "number" ||
                typeof options.keys.right !== "number"){
                    this.#error("'keys' options's properties must be of type number");
            }
            if(typeof options.useClass !== "boolean" && typeof options.useClass !== "string"){
                this.#error("'useClass' option must be of type boolean or string!");
            }
            //If mode is auto, following properties must be specified
            if(options.mode === this.#constants.mode.auto){
                if(!options.autoElements){
                    this.#error("When using 'auto' mode, autoElements option must be defined!");
                }
                if(!Array.isArray(options.autoElements)){
                    this.#error("'autoElements' option must be an array of strings!");
                }
                //Check if all autoElements entries are of type string
                let all_string = true;
                let all_valid = true;
                options.autoElements.forEach(option => {
                    if(typeof option !== "string"){
                        all_string = false;
                    }
                    if(!this.#isSelectorValid(option)){
                        all_valid = false;
                    }
                });
                if(!all_string){
                    this.#error("'autoElements' array's elements must be of type string");
                }
                if(!all_valid){
                    this.#error("'autoElements' array's elements must be valid CSS selectors!");
                }
            }
        }

        //Validates direction
        #validateDirection(direction){
            this.#validateType(direction, "string");
            if(!["up", "down", "left", "right"].includes(direction)){
                this.#error("Direction parameter must be one of the following - 'up', 'down', 'left', 'right'");
            }
        }

        //Validates whether the specified variable is of given type
        //target - target variable
        //type - type to check against
        #validateType(target, type){
            if(typeof target !== type || target === null){
                this.#error("Parameter must be of type " + type + "!");
            }
        }

        //Validates whether specified variable is a DOM entity and throws error if false
        #validateDomEntity(entity){
            if(!this.#isDomEntity(entity)){
                this.#error("Parameter must be a DOM element!");
            }
        }

        //Validates whether specified array only contains DOM entities
        #validateDomEntities(arr){
            if(!this.#areDomEntities(arr)){
                this.#error("Parameter must be an array containing only DOM elements!");
            }
        }

        //Validates whether specified variable is a valid area (is object and has following properties: x, y, height, width)
        #validateArea(area){
            this.#validateType(area, "object");
            this.#validateType(area.x, "number");
            this.#validateType(area.y, "number");
            this.#validateType(area.width, "number");
            this.#validateType(area.height, "number");
        }

        //Validates whether specified variable is array and throws error if false
        #validateArray(arr){
            if(!Array.isArray(arr)){
                this.#error("Parameter must be an array!");
            }
        }

        //Validates whether specified variable is an object with properties x, y
        #validatePoint(target){
            this.#validateType(target, "object");
            this.#validateType(target.x, "number");
            this.#validateType(target.y, "number");
        }

        //---Validators END---//

        //---Misc---//

        //Throws formatted error
        #error(string){
            if(typeof string !== "string"){
                throw new Error("NavKeys: Parameter must be of type string!");
            }
            throw new Error("NavKeys: " + string);
        }

        //Shows formatted warning in console
        #warn(string){
            this.#validateType(string, "string");
            console.warn("NavKeys: " + string);
        }

        //Checks if there is already an instance of NavKeys and throws error if there already is one
        #allow_single_instance(){
            if(navkeys_instance === null){
                navkeys_instance = this;
            }else {
                throw new Error("Only one instance of NavKeys is allowed!");
            }
        }

        //Draw nav area, for debug
        #draw_nav_area(area){
            if(this.#nav_area_element !== null){
                this.#nav_area_element.remove();
            }
            
            this.#nav_area_element = document.createElement("div");
            this.#nav_area_element.style.position = "absolute";
            this.#nav_area_element.style.top = area.y + "px";
            this.#nav_area_element.style.left = area.x + "px";
            this.#nav_area_element.style.width = area.width + "px";
            this.#nav_area_element.style.height = area.height + "px";
            this.#nav_area_element.style.zIndex = "999";
            this.#nav_area_element.style.border = "2px solid red";
            document.body.appendChild(this.#nav_area_element);
        }
        
        //Remove duplicates in an array
        #arr_remove_duplicates(arr){
            //Validation
            this.#validateArray(arr);

            const uniq = [...new Set(arr)];
            return uniq;
        }

        //Calculates the nav area for target elements, based on direction
        //element - HTMLelement relative to which to calculate
        //direction - "up", "down", "left", "right"
        #calculateNavArea(element, direction){

            this.#validateDomEntity(element);
            this.#validateDirection(direction);
            
            //Element's bounding box
            const current_rect = element.getBoundingClientRect();
            console.log(element);

            //Document width and height
            const dw = document.documentElement.clientWidth;
            const dh = document.documentElement.clientHeight;

            let nav_area = {};

            if(direction === this.#constants.direction.up){
                nav_area.x = 0;
                nav_area.y = 0;
                nav_area.width = dw;
                nav_area.height = current_rect.y;
                console.log("h: ");
                console.log(nav_area.height);
            }else if(direction === this.#constants.direction.down){
                nav_area.x = 0;
                nav_area.y = current_rect.bottom - 1;
                nav_area.width = dw;
                nav_area.height = dh - current_rect.bottom;
            }else if(direction === this.#constants.direction.left){
                nav_area.x = 0;
                nav_area.y = 0;
                nav_area.width = current_rect.x;
                nav_area.height = dh;
            }else if(direction === this.#constants.direction.right){
                nav_area.x = current_rect.right;
                nav_area.y = 0;
                nav_area.width = dw - current_rect.right;
                nav_area.height = dh;
            }

            return nav_area;
        }

        //Convert arrow key keycode to direction in string format
        #keycodeToDirection(keycode){
            console.log(keycode);
            this.#validateType(keycode, "number");
            switch(keycode){
                case this.#options.keys.up:
                    return this.#constants.direction.up;
                case this.#options.keys.down:
                    return this.#constants.direction.down;
                case this.#options.keys.left:
                    return this.#constants.direction.left;
                case this.#options.keys.right:
                    return this.#constants.direction.right;
            }
        }

        //Get distance between two points
        //a, b - {x, y}
        #distanceBetweenPoints(a, b){

            //Validation
            this.#validatePoint(a);
            this.#validatePoint(b);

            let distance = Math.hypot(b.x - a.x, b.y - a.y);
            return distance;
        }


        //Calculate distance between two elements based on their center positions
        //a, b - HTMLelement
        #distanceBetweenElementsCenter(a, b){
            const a_center = this.#getElementCenterPosition(a);
            const b_center = this.#getElementCenterPosition(b);

            return this.#distanceBetweenPoints(a_center, b_center);
        }

        //---Misc END---//

        //---Variables---//

        //Elements that are navigatable
        #nav_elements = [];
        //Currently focused element
        #current_element = null;

        //Current options
        #options = null;

        //Whether the combo key is currently held down
        #is_combo_key_down = true;

        //---Constants---//
        #constants = {
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

        #nav_area_element = null;

        /* ---Options schema---
            mode: string | "auto", "manual", "mixed"
            autoElements: array of querySelectors
            keys: { 
                up
                down
                left
                right
            }
            useClass: whether to use classes for focus style. If true, pass string for class name, if false, pass boolean false
            comboKey: if comboKey is set, navigation will only work when this key is down. False to disable
            unfocusKey: keycode for the key that will unfocus the focused element. False to disable
        */
        #default_options = {
            mode: this.#constants.mode.auto,
            autoElements: ["a", "button", "p", "li", "h1, h2, h3, h4, h5, h6"],
            keys: {
                up: this.#constants.key_code.up,
                down: this.#constants.key_code.down,
                left: this.#constants.key_code.left,
                right: this.#constants.key_code.right
            },
            useClass: false,
            comboKey: false,
            unfocusKey: false
        }
    }

    return NavKeys;

})();
