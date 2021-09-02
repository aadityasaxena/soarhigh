/*
Things to calculate:
1. score using response.wt*question.wt; (function to calc score and store in arrays)
2. launch index by comparing which questions have 'y' then calculate average by (adding scores)/total count the average/total *100
3. function to push all the values in arrays to 
*/
// $(document).ready(function () {
var len, data, p_id, benchmarkjson, stren_counter = 0, recc_counter = 0, li_score = 0, ii_score = 0, max_li = 0, max_ii = 0, weightedli = 0, weightedii = 0, func_sum = 0, func_max = 0, mat_sum = 0, mat_max = 0, m_progress, f_progress;
var response = [], q_wt = [], score = [], stren_index = [], recc_index = [], func_name = [], func_values = [], maturity_lvl = [], mat_val = [];
var strength = [], recommendation = [];

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
                calcInvestIndex()
                calcFunction();
                calcMaturity();
                calcStrengths();
                calcRecommendation();
                getBenchmark();
                domManipulation();
                function init() {
                    console.log(p_id);
                    for (var i = 0; i < len; i++) {
                        response[i] = p_id[i].response;
                        q_wt[i] = data[i].weight;
                        if (!func_name.includes(data[i].function)) {
                            func_name.push(data[i].function);
                        }
                        if (!maturity_lvl.includes(data[i].MaturityLevel)) {
                            maturity_lvl.push(data[i].MaturityLevel);
                        }
                    }
                    console.log(maturity_lvl);
                    console.log(func_name);
                    console.log(response);
                    console.log(q_wt);
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
                function calcFunction() {
                    var func_len = func_name.length;
                    for (var i = 0; i < func_len; i++) {
                        for (var j = 0; j < len; j++) {
                            if (func_name[i] === data[j].function) {
                                func_sum += score[j];
                                func_max += (data[j].weight * 9);
                            }
                        }
                        func_values[i] = Math.round((func_sum / func_max) * 100);
                    }
                }
                function calcMaturity() {
                    var mat_len = maturity_lvl.length;
                    for (var i = 0; i < mat_len; i++) {
                        for (var j = 0; j < len; j++) {
                            if (maturity_lvl[i] === data[j].MaturityLevel) {
                                mat_sum += score[j];
                                mat_max += (data[j].weight * 9);
                            }
                        }
                        mat_val[i] = Math.round((mat_sum / mat_max) * 100);
                    }
                    console.log(mat_val);


                }
                function calcStrengths() {
                    for (var i = 0; i < len; i++) {
                        if (stren_counter == 3)
                            break;
                        if (response[i] == "responseD") {
                            stren_index[stren_counter] = i;
                            stren_counter++;
                        }
                        if (i + 1 == len) {
                            for (var j = 0; j < len; j++) {
                                if (stren_counter == 3)
                                    break;
                                if (response[j] == "responseC") {
                                    stren_index[stren_counter] = j * 100;
                                    stren_counter++;
                                }

                            }
                        }
                    }
                    while (stren_index.length != 3) {
                        stren_index.push("N/A");
                    }
                    console.log(stren_index);
                    getStrength();


                }
                function calcRecommendation() {
                    for (var i = 0; i < len; i++) {
                        if (recc_counter == 5)
                            break;
                        else if (response[i] == "responseB") {
                            recc_index[recc_counter] = i;
                            recc_counter++;
                        }
                        if (i + 1 == len) {
                            for (var j = 0; j < len; j++) {
                                if (recc_counter == 5)
                                    break;
                                else if (response[j] == "responseA") {
                                    recc_index[recc_counter] = j * 100;
                                    recc_counter++;
                                }

                            }
                        }
                    }
                    while (recc_index.length != 5) {
                        recc_index.push("N/A");
                    }
                    console.log(recc_index);
                    getRecommmemdation();
                }
                function getStrength() {
                    for (var i = 0; i < 3; i++) {
                        var temp = stren_index[i];
                        if (temp === "N/A") {
                            strength[i] = "N/A";
                        }
                        else if (temp % 100 != 0)
                            strength[i] = data[temp].strength;
                        else if (temp % 100 == 0) {
                            temp /= 100;
                            strength[i] = data[temp].strength;
                        }


                    }

                }
                function getRecommmemdation() {
                    for (var i = 0; i < recc_index.length; i++) {
                        var temp = recc_index[i];
                        if (temp === "N/A") {
                            recommendation[i] = "N/A";
                        }
                        else if (temp % 100 != 0) {
                            recommendation[i] = data[temp].recommendation;
                        }
                        else if (temp % 100 == 0) {
                            temp /= 100;
                            recommendation[i] = data[temp].recommendation;
                        }

                    }

                }
                function getBenchmark() {
                    var benchhttp = new XMLHttpRequest();
                    benchhttp.onreadystatechange = function () {
                        if (this.readyState == 4 && this.status == 200) {
                            console.log("benchmark-success");
                            benchmarkjson = JSON.parse(benchhttp.response);
                            console.log(benchmarkjson);

                            if (weightedli != 0) {
                                document.getElementById('startuplaunchdomain').dataset.percentage = weightedli + "%";
                                document.getElementById('startuplaunchcountry').dataset.percentage = weightedli + "%";
                            }
                            else {
                                document.getElementById('startuplaunchdomain').dataset.percentage = 'N/A';
                                document.getElementById('startuplaunchcountry').dataset.percentage = 'N/A';
                            }
                            if (benchmarkjson[0].avglaunchdomain != 0) {
                                document.getElementById('peerlaunchdomain').dataset.percentage = benchmarkjson[0].avglaunchdomain + "%";
                            }
                            else {
                                document.getElementById('peerlaunchdomain').dataset.percentage = 'N/A';
                            }
                            if (benchmarkjson[0].avglaunchcountry != 0) {
                                document.getElementById('peerlaunchcountry').dataset.percentage = benchmarkjson[0].avglaunchcountry + "%";
                            }
                            else {
                                document.getElementById('peerlaunchcountry').dataset.percentage = "N/A";
                            }
                            if (weightedii != 0) {
                                document.getElementById('startupinvestdomain').dataset.percentage = weightedii + "%";
                                document.getElementById('startupinvestcountry').dataset.percentage = weightedii + "%";
                            }
                            else {
                                document.getElementById('startupinvestdomain').dataset.percentage = "N/A";
                                document.getElementById('startupinvestcountry').dataset.percentage = "N/A";
                            }
                            if (benchmarkjson[0].avginvestdomain != 0) {
                                document.getElementById('peerinvestdomain').dataset.percentage = benchmarkjson[0].avginvestdomain + "%";
                            }
                            else {
                                document.getElementById('peerinvestdomain').dataset.percentage = "N/A";
                            }
                            if (benchmarkjson[0].avginvestcountry != 0) {
                                document.getElementById('peerinvestcountry').dataset.percentage = benchmarkjson[0].avginvestcountry + "%";
                            }
                            else {
                                document.getElementById('peerinvestcountry').dataset.percentage = "N/A";
                            }


                            $(function () {
                                $('.bars .bar').each(function (key, bar) {
                                    var percentage = $(this).data('percentage');
                                    $(this).animate({
                                        'height': percentage
                                    }, 0);
                                });
                            });
                        }
                    };
                    benchhttp.open("GET", "../benchmark.php?c=" + p_id[len].country + "&d=" + p_id[len].domain, true);
                    benchhttp.send();

                }
                function domManipulation() {

                    document.getElementsByClassName('startup')[0].innerHTML = `Startup: ${p_id[len].startup_name}`;
                    document.getElementsByClassName('date')[0].innerHTML = `Date: ${p_id[len].date}`;
                    var launch = document.querySelector("#l-index");
                    var invest = document.querySelector("#i-index");
                    if (weightedli != 0) {
                        document.getElementById('li-text').innerText = `${weightedli}%`;
                    }
                    else
                        document.getElementById('li-text').innerText = `N/A`;

                    launch.dataset.percent = weightedli;
                    if (weightedli < 50) {
                        launch.dataset.barColor = '#FF0A2B';
                    }
                    else if (weightedli < 75 && weightedli >= 50) {
                        launch.dataset.barColor = '#F63E02';
                    }
                    else if (weightedli > 75) {
                        launch.dataset.barColor = '#3CBA26'
                    }
                    if (weightedii < 50) {
                        invest.dataset.barColor = '#FF0A2B';
                    }
                    else if (weightedii < 75 && weightedli >= 50) {
                        invest.dataset.barColor = '#F63E02';
                    }
                    else if (weightedii > 75) {
                        invest.dataset.barColor = '#3CBA26'
                    }
                    if (weightedli != 0) {
                        document.getElementById('i-text').innerText = `${weightedii}%`;
                    }
                    else
                        document.getElementById('i-text').innerText = `N/A`;
                    invest.dataset.percent = weightedii;




                    for (var i = 1; i <= func_name.length; i++) {

                        f_progress = document.querySelector(`#fn${i}`);
                        if (func_values[i - 1] != 0) {
                            f_progress.innerHTML = func_values[i - 1] + '%';
                            f_progress.style.width = func_values[i - 1] + "%";
                        }
                        else {
                            f_progress.innerHTML = "N/A";
                            f_progress.style.width = "100%";
                        }

                    }
                    for (var i = 1; i <= maturity_lvl.length; i++) {

                        m_progress = document.querySelector(`#mt${i}`);
                        if (mat_val[i - 1] != 0) {
                            m_progress.innerHTML = mat_val[i - 1] + '%';
                            m_progress.style.width = mat_val[i - 1] + "%";
                        }
                        else {
                            m_progress.innerHTML = "N/A";
                            m_progress.style.width = "100%";
                        }

                    }
                    for (var i = 0; i < 3; i++) {
                        if (typeof strength[i] !== 'undefined') {
                            document.querySelector('#ul-strength').innerHTML += `<li>${strength[i]}</li>`;
                        }
                        else {
                            document.querySelector('#ul-strength').innerHTML += `<li>N/A</li>`
                        }
                    }
                    for (var i = 0; i < 5; i++) {
                        if (typeof recommendation[i] !== 'undefined')
                            document.querySelector('#ul-recommendation').innerHTML += `<li>${recommendation[i]}</li>`

                    }
                    $(function () {
                        $('.chart').easyPieChart({
                            //your options goes here
                        });
                    });

                }


            }
        }
        xhttp.open('GET', '../retrieve.php', true);
        xhttp.send();

    });
// });
