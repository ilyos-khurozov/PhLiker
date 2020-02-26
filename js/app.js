var curPage = 1, pages=1, curPic=0;
var tagText = "";
var ids = [];
var links = [];

function load(){
    //console.log(curPage+"-page");
    
    var url = "https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=950888e0219426f8682b3027344570f0&format=json&nojsoncallback=1";
    
    $.getJSON( url, {
        tags: tagText,
        tagmode: "any",
        per_page: "18",
        page: curPage
    }).done(function(data){
        pages = data.photos.pages;
        if(pages == 0){
            alert("Images not found.");
            return;
        }
        if(pages > 100) pages = 100;
        $("#grid").empty();

        var arr = data.photos.photo;
        var row = "";
        for (i in arr) {
            var img= arr[i];
            links[i] = "https://farm"+img.farm+".staticflickr.com/"+img.server+"/"+img.id+"_"+img.secret+"_q.jpg";
            ids[i] = img.id;

            row += '<td><img src="'+links[i]+'" onclick="detailed('+i+')"></td>';
            if (i % 6 == 5) {
                $("#grid").append("<tr>"+row+"</tr>");
                row = "";
            }
        }

        if(row != '') $("#grid").append("<tr>"+row+"</tr>");

        paginate();

    }).fail(function(){
        alert("Failed");
    });

    $("#inputTop").val(tagText);
}

function paginate(){
    $("#grid").append(
        '<tr id="row"><td colspan = 4>'+
            '<ul class="pagination justify-content-center" id="pageBar"></ul>'+
        '</td></tr>'
    );
    
    $("#pageBar").append(
        '<li class="page-item"onclick="prevPage();"><p class="page-link">Previous page</p></li>'+
        '<li class="page-item" onclick="toPage(1);"><p class="page-link">1</p></li>'+
        '<li class="page-item"><p class="page-link">..</p></li>'+
        '<li class="page-item"><p class="page-link">'+curPage+'</p></li>'+
        '<li class="page-item"><p class="page-link">..</p></li>'+
        '<li class="page-item" onclick="toPage('+pages+');"><p class="page-link">'+pages+'</p></li>'+
        '<li class="page-item"onclick="nextPage();"><p class="page-link">Next page</p></li>'
    );

    var $children = $("#pageBar").children();

    if(curPage == 1){
        $children.first().addClass("disabled");
        $children.eq(1).addClass("active");
        $children.eq(3).remove();
        $children.eq(2).remove();
    } else if (curPage == pages){
        $children.eq(3).remove();
        $children.eq(2).remove();
        $children.eq(5).addClass("active");
        $children.last().addClass("disabled");
    } else {
        $children.eq(3).addClass("active");
    }

    if(pages == 1){
        $children.eq(5).remove();
        $children.eq(4).remove();
        $children.last().addClass("disabled");
    }

    $("#row").append(
        '<td colspan=2><div class="navbar navbar-expand navbar-dark justify-content-center">'+
            '<input type="text" id="inputPage" placeholder="Page"'+
                'class="form-control form-control-pliantext mx-2" style="width: 15rem">'+
            '<button type="button" class="btn btn-primary" onclick="toPage()" id="btnPage">Go !</button>'+
        '</div></td>'
    );
}

function prevPage(){
    if (curPage == 1) return;

    curPage--;
    load();
}

function nextPage(){
    if (curPage == pages) return;

    curPage++;
    load();
}

function toPage(page=0){
    if(page == 0){
        page = parseInt($("#inputPage").val());
        
        if(Number.isNaN(page)){
            alert("Enter the correct number !");
            return;
        }
    }

    if(page < 1 || page > pages){
        alert("There is no page with the number "+page+" !");
        return;
    }

    curPage = page;
    load();
}

function search(inp){
    curPage = 1;
    $("#btnTop").prop("disabled", true);
    $("#btnCenter").prop("disabled", true);
    
    if(inp == 0) {
        tagText = $("#inputTop").val().toLowerCase()
    } else {
        tagText = $("#inputCenter").val().toLowerCase();
    }

    load();
    $("#btnCenter").removeAttr("disabled");
    $("#btnTop").removeAttr("disabled");
};

function detailed(indx){
    var infoUrl = "https://www.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=950888e0219426f8682b3027344570f0&format=json&nojsoncallback=1";
    $.getJSON(infoUrl, {
        photo_id: ids[indx]
    }).done(function(data){
        var info = data.photo;
        curPic = indx;
        $("#curImage").attr("src", links[indx]);
        $("#title").text(info.title._content);
        $("#photograph").text(info.owner.realname);
        
        if (curPic == 0) $("#btnPrevImage").addClass("disabled");
        else $("#btnPrevImage").removeClass("disabled");
        
        if (curPic == 17) $("#btnNextImage").addClass("disabled");
        else $("#btnNextImage").removeClass("disabled");

        $("#detail").modal();
    }).fail(function(){
        alert("Failed info");
    });    
};

function nextImage(){
    if(curPic == 17) return;
    detailed(curPic+1);
}

function prevImage(){
    if (curPic == 0) return;
    detailed(curPic-1);
}