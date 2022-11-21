var NavKeys = (function () {
    'use strict';

    let navkeys_instance = null;


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

        /* ---Options schema---
            mode: string | "auto", "manual", "mixed"
            autoElements: array of querySelectors
            focusOutline: css border property
        */
        default_options = {
            mode: this.constants.mode.auto,
            autoElements: ["a", "button", "p"],
            //focusOutline: "2px solid green"
        }

        //Check if script is running in browser or server
        is_browser(){
            if(typeof window !== "undefined"){
                return true;
            }
            return false;   
        }

        //Checks if there is already an instance of NavKeys and throws error if there already is one
        allow_single_instance(){
            if(navkeys_instance === null){
                navkeys_instance = this;
            }else {
                throw new Error("Only one instance of NavKeys is allowed!");
            }
        }

        //---Constructor---//
        constructor(options = null){
            if(!this.is_browser()){
                console.log("NavKeys is intended for browsers, not servers!");
            }

            this.allow_single_instance();

            options = {...this.default_options, ...options};

            //Add nav_elements for auto/mixed modes
            if(options.mode === this.constants.mode.auto || options.mode === this.constants.mode.mixed){
                if(options.autoElements === undefined || options.autoElements === null || !Array.isArray(options.autoElements)){
                    throw new Error("Invalid autoElements option!");
                }else {
                    //Add elements to nav_elements that match the options.autoElements queries
                    options.autoElements.forEach(query => {
                        //console.log("query: " + query);
                        const elements = document.querySelectorAll(query);
                        elements.forEach(item => {
                            //console.log(item);
                            this.nav_elements.push(item);
                        });
                    });
                    //Remove duplicates
                    this.nav_elements = this.arr_remove_duplicates(this.nav_elements);
                    this.setTabIndex(this.nav_elements);
                }
            }//Add nav_elements for manual mode
            else if(options.mode === this.constants.mode.manual);
            else {
                throw new Error("Invalid NavKeys mode!");
            }

            window.addEventListener("keydown", event => {
                if( event.keyCode === this.constants.key_code.up ||
                    event.keyCode === this.constants.key_code.down ||
                    event.keyCode === this.constants.key_code.right ||
                    event.keyCode === this.constants.key_code.left ){
                        const direction = this.keycodeToDirection(event.keyCode);
                        //console.log("Arrow key pressed: " + direction);
                        this.navigate(direction);
                }
            });
        }

        //Generates css styles
        generateCSS(){
        }

        //Set tab index attribute for elements.
        //Necessary to make elements such as 'p' focusable
        setTabIndex(elements){
            elements.forEach(element => {
                element.setAttribute("tabindex", "4");
            });
        }

        //Navigate to another element
        //Direction = "up", "down", "left", "right"
        navigate(direction){

            if(this.current_element === null){
                this.current_element = this.getTompostElement(this.nav_elements);
                this.focus(this.current_element);
                return;
            }
            //console.log(this.current_element);
            this.current_element = document.activeElement;

            /*The area in which the navigation will occur
                (if direction = up, then above the current element, 
                if direction = right, then to the right of current element, etc.)
            */
            let nav_area = this.calculateNavArea(this.current_element, direction);
            
            

            //let target_elements = [];

            
            

            const target_elements = this.getElementsInsideArea(this.nav_elements, nav_area);
            if(target_elements.length > 0){
                const navigate_to = this.getClosestElementCenter(this.current_element, target_elements);

                this.focus(navigate_to);
            }

            console.log(target_elements);

            

            //console.log(nav_area);
        }

        //Focus element
        //element - HTMLelement to focus
        focus(element){
            element.focus();
            this.current_element = element;
        }

        //Draw nav area, for debug
        draw_nav_area(area){
            if(this.nav_area_element !== null){
                this.nav_area_element.remove();
            }
            
            this.nav_area_element = document.createElement("div");
            this.nav_area_element.style.position = "absolute";
            this.nav_area_element.style.top = area.y + "px";
            this.nav_area_element.style.left = area.x + "px";
            this.nav_area_element.style.width = area.width + "px";
            this.nav_area_element.style.height = area.height + "px";
            this.nav_area_element.style.zIndex = "999";
            this.nav_area_element.style.border = "2px solid red";
            document.body.appendChild(this.nav_area_element);
        }
        nav_area_element = null;

        //Remove duplicates in an array
        arr_remove_duplicates(arr){
            const uniq = [...new Set(arr)];
            return uniq;
        }

        //Calculates the nav area for target elements, based on direction
        //element - HTMLelement relative to which to calculate
        //direction - "up", "down", "left", "right"
        calculateNavArea(element, direction){

            //console.log("calculating nav area: ");
            //console.log(element);
            //console.log(direction);
            
            //Element's bounding box
            const current_rect = element.getBoundingClientRect();

            //Document width and height
            const dw = document.documentElement.clientWidth;
            const dh = document.documentElement.clientHeight;

            let nav_area = {};

            if(direction === this.constants.direction.up){
                nav_area.x = 0;
                nav_area.y = 0;
                nav_area.width = dw;
                nav_area.height = current_rect.y;
            }else if(direction === this.constants.direction.down){
                nav_area.x = 0;
                nav_area.y = current_rect.bottom;
                nav_area.width = dw;
                nav_area.height = dh - current_rect.bottom;
            }else if(direction === this.constants.direction.left){
                nav_area.x = 0;
                nav_area.y = 0;
                nav_area.width = current_rect.x;
                nav_area.height = dh;
            }else if(direction === this.constants.direction.right){
                nav_area.x = current_rect.right;
                nav_area.y = 0;
                nav_area.width = dw - current_rect.right;
                nav_area.height = dh;
            }

            return nav_area;
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
            //console.log("elements");
            //console.log(elements);
            if(elements.length < 1){
                throw new Error("Nav elements count = 0");
            }
            let highest_element = elements[0];
            elements.forEach(element => {
                if(element.getBoundingClientRect().y < highest_element.getBoundingClientRect().y){
                    highest_element = element;
                }
            });
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
            });
            return leftmost_element;
        }

        //Get elements that are contained inside an area
        //elements - HTML elements
        //area - {x, y, width, height}
        //Returns array of filtered elements
        getElementsInsideArea(elements, area){
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
        getElementCenterPosition(element){
            const rect = element.getBoundingClientRect();
            const x = rect.x + (rect.width / 2);
            const y = rect.y + (rect.height / 2);

            return {x, y};
        }

        //Get distance between two points
        //a, b - {x, y}
        distanceBetweenPoints(a, b){
            let distance = Math.hypot(b.x - a.x, b.y - a.y);
            return distance;
        }


        //Calculate distance between two elements based on their center positions
        //a, b - HTMLelement
        distanceBetweenElementsCenter(a, b){
            const a_center = this.getElementCenterPosition(a);
            const b_center = this.getElementCenterPosition(b);

            return this.distanceBetweenPoints(a_center, b_center);
        }

        //Get closest of a number of elements to a single target element. Calculating from element's center position
        //from_element - HTML element from which to calculate
        //to_elements - array of HTML element to which to compare
        getClosestElementCenter(from_element, to_elements){
            let closest = to_elements[0];
            let closest_distance = this.distanceBetweenElementsCenter(from_element, to_elements[0]);
            to_elements.forEach(to_element => {
                const compare_distance = this.distanceBetweenElementsCenter(from_element, to_element);
                if(compare_distance < closest_distance){
                    closest_distance = compare_distance;
                    closest = to_element;
                }
            });
            return closest;
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

    return NavKeys;

})();
