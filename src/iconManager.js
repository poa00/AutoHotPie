class IconOption {
    constructor(_file){
        // this.file = _file;
        let newIconDiv = selectIconPage.iconTempElement.clone()[0];
        newIconDiv.childNodes[1].childNodes[0].src = _file
        let iconName = nodePath.basename(_file,".png");
        // this.name = iconName;
        newIconDiv.childNodes[1].childNodes[2].innerHTML = iconName;        
        this.elementDiv = newIconDiv;
    }     
}

var selectIconPage = {    
    rejectPromise: null,
    resolvePromise: null,
    filterIcons: function(iconDivs, searchString){
        return iconDivs.filter(iconOption => iconOption.name.includes(searchString));       
    },
    stock:{
        icons:[],        
        iconSearchInput: $('#stock-icons-search-input'),
        iconDiv: $('#stock-icon-library'),
        refreshDisplay: function(searchString=""){
            if(searchString==""){
                //Show all
                let iconDivs = this.iconDiv.find('div');
                iconDivs.show();
            } else {     
                let iconDivs = this.iconDiv.find('div');
                iconDivs.show();                
                let searchPattern = new RegExp(searchString, 'i')
                let foundIconDivs = this.iconDiv.contents().filter( (index,value)=>{
                    
                    return !searchPattern.test(value.childNodes[1].childNodes[2].innerHTML);                    
                });
                foundIconDivs.hide();
            }
            return
        }
    },
    user:{        
        icons:[],
        iconSearchInput: $('#user-icons-search-input'),
        iconDiv: $('#user-icon-library'),
        refreshDisplay: function(searchString=""){
            if(searchString==""){
                //Show all
                let iconDivs = this.iconDiv.find('div');
                iconDivs.show();
            } else {     
                let iconDivs = this.iconDiv.find('div');
                iconDivs.show();                
                let searchPattern = new RegExp(searchString, 'i')
                let foundIconDivs = this.iconDiv.contents().filter( (index,value)=>{
                    
                    return !searchPattern.test(value.childNodes[1].childNodes[2].innerHTML);                    
                });                
                foundIconDivs.hide();
            }
            return
        },
        addUserIconsBtn: $('#add-icons-btn'),
        manageIconsBtn: $('#manage-icons-btn')
    },
    backBtn: $('#icon-manager-back-btn'),
    refreshIconsBtn: $('#refresh-icons-btn'),
    iconTempElement:$('#template-select-icon-div'),  
    open:function(){
        $('[href="#tab-28"]').tab('show');
        this.stock.iconSearchInput.val("");            
        this.user.iconSearchInput.val("") ;           
    },
    initialize:function(){
        function handleIconSelection(event){
            // console.log(event.target)
            if(event.target.name == "selectable-icon-div"){                
                // let selectedIconImage = 
                // selectIconPage.resolvePromise(selectedIconImage);                
            }
        };
        this.stock.iconDiv.on('click', '#template-select-icon-div', (e) => {
            // console.log(e.currentTarget)
            // console.log(e.currentTarget.childNodes[1].childNodes[0])
            let returnImg = e.currentTarget.childNodes[1].childNodes[0].src;            
            if (returnImg){
                // console.log(returnImg)
                selectIconPage.resolvePromise(returnImg)
            }
        });
        this.stock.iconSearchInput.on('input', function(){
            let value = $(this).val();
            if ($(this).data("lastval") != value) {
                $(this).data("lastval", value);
                clearTimeout(searchTimerId);
                searchTimerId = setTimeout(function() {                
                selectIconPage.stock.refreshDisplay(value);
                }, 300);
            };             
        });
        this.user.iconDiv.on('click', '#template-select-icon-div', (e) => {
            // console.log(e.currentTarget)
            // console.log(e.currentTarget.childNodes[1].childNodes[0])
            let returnImg = e.currentTarget.childNodes[1].childNodes[0].src;       
            if (returnImg){
                selectIconPage.resolvePromise(returnImg)
            }
        });

        let searchTimerId
        this.user.iconSearchInput.on('input', function(){
            let value = $(this).val();
            if ($(this).data("lastval") != value) {

                $(this).data("lastval", value);
                clearTimeout(searchTimerId);

                searchTimerId = setTimeout(function() {
                //your change action goes here
                selectIconPage.user.refreshDisplay(value);
                }, 300);
            };             
        });
        
        this.backBtn.on('click', () => {
            selectIconPage.rejectPromise();
        });
        this.user.addUserIconsBtn.on('click', () => {
            iconManager.addIcons();
            selectIconPage.refreshIcons();
        });
        this.user.manageIconsBtn.on('click', () => {
            iconManager.openUserIconFolder();
        });
        this.refreshIconsBtn.on('click', () => {
            iconManager.refreshIconLibrary();
            this.refreshIcons();
        });
        this.refreshIcons();      
    },      
    refreshIcons:function(){
        //Refresh default icons
        iconManager.refreshIconLibrary();        
        this.stock.iconDiv.html('');
        this.stock.icons = [];
        this.user.icons = [];
        iconManager.getDefaultIcons().then((files) => {        
            files.forEach((iconFile)=>{
                let iconOption = new IconOption(iconFile);
                selectIconPage.stock.iconDiv.append(iconOption.eelementDiv);
                selectIconPage.stock.icons.push(iconOption);
                this.stock.refreshDisplay();                
            })
        },(err)=>{console.log(err)});

        //Refresh user icons
        this.user.iconDiv.html('');
        iconManager.getUserIcons().then((files) => {            
            files.forEach((iconFile)=>{
                // console.log(iconFile);
                let iconOption = new IconOption(iconFile);
                selectIconPage.user.iconDiv.append(iconOption.elementDiv);
                selectIconPage.user.icons.push(iconOption);
                this.user.refreshDisplay();
            })
        },(err)=>{console.log(err)});      
    },
    selectIcon: async function(){        
        this.refreshIcons();
        this.open();
        let myPromise = await waitForUserInput()
        return myPromise
        function waitForUserInput(){
            return new Promise((resolve, reject) => {
                selectIconPage.resolvePromise = resolve;
                selectIconPage.rejectPromise = reject; 
            });
        }
    }
    
}

// selectIconPage.initialize();

