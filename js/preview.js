/*
Things to calculate:
1. score using response.wt*question.wt; (function to calc score and store in arrays)
2. launch index by comparing which questions have 'y' then calculate average by (adding scores)/total count the average/total *100
3. function to push all the values in arrays to 
*/
// $(document).ready(function () {
var len, data, p_id, li_score = 0, ii_score = 0, max_li = 0, max_ii = 0, weightedli = 0, weightedii = 0;
var response = [], q_wt = [], score = [];

$.when(
    $.ajax({
        type: "GET",
        url: "/soar-vision/documents/MiniAssessment.csv",
        dataType: "text",
        success: function (response) {
            data = $.csv.toObjects(response);
            console.log(data);
            len = data.length;
            console.log(len);

        },
    })).then(function () {
        var xhttp;
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4) {
                console.log("success");
                p_id = JSON.parse(xhttp.response);
                console.log(p_id);

                init();
                calcScore();
                calcLaunchIndex();
                calcInvestIndex();
                domManipulation();
                function init() {
                    console.log(p_id);
                    for (var i = 0; i < len; i++) {
                        response[i] = p_id[i].response;
                        q_wt[i] = data[i].weight;
                        
                    }
                    
                }
                function calcScore() {

                    for (var i = 0; i < len; i++) {
                        switch (response[i]) {
                            case "responseA": score[i] = 0;
                                break;
                            case "responseB": score[i] = q_wt[i] * 1;
                                break;
                            case "responseC": score[i] = q_wt[i] * 5;
                                break;
                            case "responseD": score[i] = q_wt[i] * 9;
                                break;
                        }

                    }
                }
                function calcLaunchIndex() {
                    for (var i = 0; i < len; i++) {
                        if (data[i].launchIndex == 'y') {
                            li_score += score[i];
                            max_li += (data[i].weight * 9);

                        }
                    }
                    weightedli = Math.round((li_score / max_li) * 100);

                }
                function calcInvestIndex() {
                    for (var i = 0; i < len; i++) {
                        if (data[i].investIndex == 'y') {
                            ii_score += score[i];
                            max_ii += (data[i].weight * 9);
                        }
                    }
                    weightedii = Math.round((ii_score / max_ii) * 100);


                }      
                function domManipulation() {
                    document.getElementById("li").innerText = `${weightedli}%`;
                    document.getElementById("ii").innerText = `${weightedii}%`;
                }         
                
                

            }
        }
        xhttp.open('GET', '/soar-vision/retrieve.php', true);
        xhttp.send();

    });
// });
