/*
 * This program was produced for the U.S. Agency for International Development. It was prepared by the USAID | DELIVER PROJECT, Task Order 4. It is part of a project which utilizes code originally licensed under the terms of the Mozilla Public License (MPL) v2 and therefore is licensed under MPL v2 or later.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the Mozilla Public License as published by the Mozilla Foundation, either version 2 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the Mozilla Public License for more details.
 *
 * You should have received a copy of the Mozilla Public License along with this program. If not, see http://www.mozilla.org/MPL/
 */

function BarcodeStockAdjustmentController($scope,$log, $http, $timeout,$window,$routeParams,StockCardsByCategory,configurations,StockEvent,localStorageService,homeFacility,VaccineAdjustmentReasons,UserFacilityList) {

    //Get Home Facility
    $scope.currentStockLot = undefined;
    $scope.adjustmentReasonsDialogModal = false;
    $scope.userPrograms=configurations.programs;
    $scope.adjustmentReason={};
    $scope.vvmStatuses=[{"value":"1","name":" 1 "},{"value":"2","name":" 2 "}];
    $scope.productsConfiguration=configurations.productsConfiguration;
    var AdjustmentReasons=[];
    $scope.data = {};
    $scope.data.allowMultipleScan = true;
    $scope.useBarcode = true;
    $timeout(function(){
        $("#barcode_string").focus();
    });

    //put all values in the local storage
    $scope.addToLocal = function(){
        $log.info('saving gtin lookup locally')
        $http.get('/vaccine/gitn_lookup/all').success(function(data) {
            $scope.gtin_lookups = data.gitn_lookup;
            localStorageService.add('gtin_lookup',JSON.stringify(data.gitn_lookup));
            $log.info('gtin lookup saved locally')
        });
    };
    $scope.addToLocal();

    //pull all gtin information
    //@todo Put these data in local storage and update the method to fetch from local store
    $http.get('/vaccine/gitn_lookup/all').success(function(data) {
        $scope.gtin_lookups = data.gitn_lookup;
        var se1 = localStorageService.add('gtin_lookup',JSON.stringify(data.gitn_lookup));
        var se = localStorageService.get('gtin_lookup')
        console.log(se)
    }).
    error(function(data) {
        console.log("Error:" + data);
    });
    $scope.data.loading_item = false;

    //react to scanning of lot number
    $scope.scanLotNumber = function(barcodeString){
        if(barcodeString !== ""){
            $scope.barcode ={};
            $scope.barcode.lot_number = "";
            $scope.barcode.gtin = "";
            $scope.barcode.expiry = "";
            //check for the GS1 character
            if(barcodeString.substring(0,3) === "]d2"){
                if(barcodeString.length > 45){
                    var n = barcodeString.lastIndexOf("21");
                    $scope.barcode.expiry = barcodeString.substring(21,27);
                    $scope.barcode.gtin = barcodeString.substring(5,19);
                    $scope.barcode.lot_number = barcodeString.substring(29,n);
                }else if(barcodeString.length >= 29){
                    $scope.barcode.lot_number = barcodeString.substring(29);
                    $scope.barcode.expiry = barcodeString.substring(21,27);
                    $scope.barcode.gtin = barcodeString.substring(5,19);
                }else{
                    $scope.data.error_loading_gtin = true;
                    $scope.data.error_loading_item = false;
                    $scope.data.loading_item = false;
                }
            }else if(barcodeString.substring(0,2) === "01"){
                if(barcodeString.length > 45){
                    var n = barcodeString.lastIndexOf("21");
                    $scope.barcode.expiry = barcodeString.substring(18,24);
                    $scope.barcode.gtin = barcodeString.substring(2,16);
                    $scope.barcode.lot_number = barcodeString.substring(26,n);
                }else if(barcodeString.length >= 29){
                    $scope.barcode.lot_number = barcodeString.substring(26);
                    $scope.barcode.expiry = barcodeString.substring(18,24);
                    $scope.barcode.gtin = barcodeString.substring(2,16);
                }else{
                    $scope.data.error_loading_gtin = true;
                    $scope.data.error_loading_item = false;
                    $scope.data.loading_item = false;
                }

            }else{
                $scope.data.error_loading_gtin = true;
                $scope.data.error_loading_item = false;
                $scope.data.loading_item = false;
            }


            $scope.data.loading_item = true;
            var str = $scope.barcode.expiry;
            str = str.slice(str.length -2);
            if(str == '00'){
                $scope.barcode.expiry = $scope.barcode.expiry.slice( 0, $scope.barcode.expiry.length-2 ) + '01'
            }
            $scope.barcode.formatedDate = $scope.formatDate(new Date("20"+$scope.barcode.expiry.replace(/(.{2})/g,"$1-").slice(0, -1)));
            $scope.current_item = $scope.getItemByGTIN($scope.barcode , $scope.productsInList);
            if($scope.current_item.gtinInformation === false){
                $scope.data.error_loading_gtin = true;
                $timeout(function(){
                    $scope.data.error_loading_gtin = false;
                },2000);
                $scope.data.error_loading_item = false;
                $scope.data.loading_item = false;
                var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
                snd.play();
            }else{
                $scope.data.error_loading_gtin = false;
                $scope.data.error_loading_item = false;
                $scope.data.loading_item = true;
                if($scope.current_item.available === false){
                    $scope.data.error_loading_item = true;
                    $timeout(function(){
                        $scope.data.error_loading_item = false;
                    },2000);
                    $scope.data.loading_item = false;
                    var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
                    snd.play();
                }else{

                    $scope.data.error_loading_item = false;
                    $scope.data.loading_item = false;
                    $scope.data.show_singleItem = true;
                    $scope.data.process_package = false;
                }
            }

        }else{
            $scope.data.error_loading_gtin = false;
            $scope.data.error_loading_item = false;
            $scope.data.loading_item = false;
        }


    };

    //a function to format date from the GTIN String
    $scope.formatDate = function (date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2){ month = '0' + month;}
        if (day.length < 2) { day = '0' + day; }

        return [year, month, day].join('-');
    };

    //finding an item from the gtin Lookup table
    $scope.getItemByGTIN = function(barcode_object,listItems){
        var item = {available:false,gtinInformation:false};
        angular.forEach($scope.gtin_lookups,function(packagingInformation){
            if(barcode_object.gtin == packagingInformation.gtin){
                item.gtinInformation = true;
                angular.forEach(listItems,function(product){
                    if(packagingInformation.productid == product.product.id){
                        //append packaging information
                        product.packaging = packagingInformation;

                        //construct a lot
                        var lots = angular.copy(product.lotsOnHand);
                        angular.forEach(lots,function(productLot){
                            //if(productLot.lot.lotCode == barcode_object.lot_number && barcode_object.formatedDate == productLot.lot.expirationDate){
                            if(productLot.lot.lotCode == barcode_object.lot_number){
                                item.available = true;
                                //adding products to list of items to be displayed
                                if(!$scope.stockCardsToDisplay[$scope.vaccineIndex].productCategory) {
                                    $scope.stockCardsToDisplay[$scope.vaccineIndex].productCategory = "Vaccine";
                                    $scope.stockCardsToDisplay[$scope.vaccineIndex].stockCards = [];
                                }
                                if($scope.checkProductInList($scope.stockCardsToDisplay[$scope.vaccineIndex].stockCards, product.product.id)){
                                    angular.forEach($scope.stockCardsToDisplay[$scope.vaccineIndex].stockCards, function(item){
                                        if(item.product.id == packagingInformation.productid){
                                            if($scope.checkLOtInList(item.lotsOnHand,barcode_object.lot_number)){
                                                angular.forEach(item.lotsOnHand,function(singleLot){
                                                    if(singleLot.lot.lotCode == barcode_object.lot_number){
                                                        if($scope.data.allowMultipleScan){
                                                            singleLot.boxes++;
                                                            console.log(JSON.stringify(singleLot));
                                                            $scope.updateCurrentTotal1(item,singleLot);
                                                        }
                                                    }

                                                });
                                            }else{
                                                if($scope.data.allowMultipleScan){
                                                    productLot.boxes = 1;
                                                    productLot.vials = 0;
                                                    item.lotsOnHand.push(productLot);
                                                    var indexToUse = item.lotsOnHand.length -1;
                                                    $scope.updateCurrentTotal1(item,item.lotsOnHand[indexToUse]);
                                                }else{
                                                    productLot.boxes = 0;
                                                    productLot.vials = 0;
                                                    item.lotsOnHand.push(productLot);
                                                }

                                            }
                                        }
                                    });
                                    //if it is a new item completely.
                                }else{
                                    var productToPush = angular.copy(product);
                                    productToPush.lotsOnHand = [];
                                    if($scope.data.allowMultipleScan){
                                        productToPush.boxes = 1;
                                        productToPush.vials = 0;
                                        productLot.boxes = 1;
                                        productLot.vials = 0;
                                        productToPush.lotsOnHand.push(productLot);
                                        $scope.updateCurrentTotal1(productToPush,productLot);
                                        $scope.stockCardsToDisplay[$scope.vaccineIndex].stockCards.push(productToPush);
                                        console.log(JSON.stringify($scope.stockCardsToDisplay[$scope.vaccineIndex].stockCards[0].lotsOnHand[0]))

                                    }else{
                                        productToPush.boxes = 0;
                                        productToPush.vials = 0;
                                        productLot.boxes = 0;
                                        productLot.vials = 0;
                                        productToPush.lotsOnHand.push(productLot);
                                        $scope.stockCardsToDisplay[$scope.vaccineIndex].stockCards.push(productToPush);
                                    }

                                }
                            }
                        });
                    }
                });
            }
        });
        $("#barcode_string").val('');
        angular.element(jQuery('#barcode_string')).triggerHandler('input');
        return item;
    };

    //update the stock adjustment reason for each update
    ///////////////////////////////////////////////////////
    $scope.defaultAdjustmentAmount = function(lot){
        //procedure to show the modal
        $scope.oldAdjustmentReason = angular.copy(lot.AdjustmentReasons);
        $scope.currentStockLot = lot;
        $scope.currentStockLot.adjustmentReasons=((lot.adjustmentReasons === undefined)?[]:lot.adjustmentReasons);
        //Remove reason already exist from drop down
        reEvaluateTotalAdjustmentReasons();
        updateAdjustmentReasonForLot(lot.adjustmentReasons);

        //calling the save adjustment reason
        var adjustmentReason={};
        adjustmentReason.type = $scope.adjustmentReasonsToDisplay[0];
        adjustmentReason.name = $scope.adjustmentReasonsToDisplay[0].name;
        adjustmentReason.quantity= Math.abs(lot.quantity - lot.quantityOnHand);
        $scope.currentStockLot.adjustmentReasons = [];
        $scope.currentStockLot.adjustmentReasons.push(adjustmentReason);
        updateAdjustmentReasonForLot($scope.currentStockLot.adjustmentReasons);
        reEvaluateTotalAdjustmentReasons();

    };

    $scope.checkProductInList = function(list,productID){
        var data = false;
        angular.forEach(list,function(product){
            if(productID == product.product.id){
                data = true;
            }
        });
        return data;
    };

    $scope.checkLOtInList = function(list,lotcode){
        var data = false;
        angular.forEach(list,function(product){
            if(lotcode == product.lot.lotCode){
                data = true;
            }
        });
        return data;
    };

    //get Maximum number of boxes one can have per product based on amount on store
    $scope.getMaximumBoxes = function(product,quantityOnHand){
        return parseInt(quantityOnHand / (product.packaging.dosespervial * product.packaging.vialsperbox));
    };
    //get Maximum number of lose vials one can have
    $scope.getMaximumLoseVials = function(product,quantityOnHand,boxes){
        var dosesOnBoxes = boxes*product.packaging.dosespervial * product.packaging.vialsperbox;
        var remainingDoses = quantityOnHand - dosesOnBoxes;
        return parseInt(remainingDoses / (product.packaging.dosespervial));
    }

    //update the number of doses when there is a change in boxes and lose vials
    $scope.updateCurrentTotal1  = function(product,lot){
        var vials_per_box = product.packaging.vialsperbox;
        var doses_per_vials = product.packaging.dosespervial;
        if(lot){
            var boxes = (lot.boxes === '')?0:lot.boxes;
            var vials = (lot.vials === '')?0:lot.vials;
            var num = 0;
            if(boxes != 0){
                num += boxes*vials_per_box*doses_per_vials;
            }if(vials != 0){
                if(vials >= vials_per_box){
                    lot.boxes = lot.boxes + Math.floor(vials / vials_per_box)
                    vials = vials % vials_per_box;
                    lot.vials = vials % vials_per_box;
                }
                num += doses_per_vials*vials;
            }
            lot.quantity = num;
            var totalCurrentLots = 0;
            if(product.lots !== undefined)
            {
                $(product.lots).each(function (index, lotObject) {
                    if(lotObject.quantity !== undefined && lotObject.quantity !== null){
                        totalCurrentLots = totalCurrentLots + parseInt(lotObject.quantity,10);
                    }
                });
                product.quantity=totalCurrentLots;
            }
            else{
                product.quantity=product.quantity;
            }
            $scope.defaultAdjustmentAmount(lot);
        }else{
            var boxes = (product.boxes === '')?0:product.boxes;
            var vials = (product.vials === '')?0:product.vials;
            var num = 0;
            if(boxes != 0){
                num += boxes*vials_per_box*doses_per_vials;
            }if(vials != 0){
                num += doses_per_vials*vials;
            }
            product.quantity = num;
        }


    };

    //update the total doses for the product and the boxes and vials for a updated value
    $scope.updateCurrentTotal=function(product,lot){
        var vials_per_box = product.packaging.vialsperbox;
        var doses_per_vials = product.packaging.dosespervial;
        var dosesInBox = vials_per_box*doses_per_vials;

        //update boxes and vials as doses change
        if(lot){
            lot.boxes = parseInt(lot.quantity / dosesInBox);
            lot.vials = lot.quantity % dosesInBox;
            $scope.defaultAdjustmentAmount(lot);
        }else{
            product.boxes = parseInt(product.quantity / dosesInBox);
            product.vials = product.quantity % dosesInBox;
        }
    };

    //method to control switching between barcode and normal
    $scope.switchBarcodeToNormal = function(){
        if($scope.userPrograms.length > 1)
        {
            $scope.showPrograms=true;
            //TODO: load stock cards on program change
            $scope.selectedProgramId=$scope.userPrograms[0].id;
            loadStockCards(parseInt($scope.selectedProgramId,10),parseInt($scope.selectedFacilityId,10),$scope.useBarcode);

        }
        else if($scope.userPrograms.length === 1){
            $scope.showPrograms=false;
            $scope.selectedProgramId=$scope.userPrograms[0].id;
            loadStockCards(parseInt($scope.selectedProgramId,10),parseInt($scope.selectedFacilityId,10),$scope.useBarcode);

        }
    };

    //loading stock cards...added some functionality to allow barcode
    var loadStockCards=function(programId, facilityId,useBarcode){
        //@todo Put these data in local storage and update the method to fetch from local store
        StockCardsByCategory.get(programId,facilityId).then(function(data){
            $scope.stockCardsToDisplay=data;
            if(useBarcode){
                //These codes have been added by Kelvin
                if($scope.stockCardsToDisplay.length !== 0){
                    angular.forEach($scope.stockCardsToDisplay,function(lineItem,index){
                        if(lineItem.productCategory === "Vaccine"){
                            $scope.productsInList = angular.copy(lineItem.stockCards);
                            $scope.stockCardsToDisplay[index] = {};
                            $scope.vaccineIndex = index;
                        }
                    });

                }else{
                    $scope.productsInList = [];
                }
            }else{

            }

            VaccineAdjustmentReasons.get({programId:programId},function(data){
                $scope.adjustmentTypes=data.adjustmentReasons;
            });
        });
    };
    if(homeFacility){
        $scope.homeFacility = homeFacility;
        $scope.homeFacilityId=homeFacility.id;
        $scope.selectedFacilityId=homeFacility.id;
        $scope.facilityDisplayName=homeFacility.name;
    }
    if($scope.userPrograms.length > 1)
    {
        $scope.showPrograms=true;
        //TODO: load stock cards on program change
        $scope.selectedProgramId=$scope.userPrograms[0].id;
        loadStockCards(parseInt($scope.selectedProgramId,10),parseInt($scope.selectedFacilityId,10),$scope.useBarcode);

    }
    else if($scope.userPrograms.length === 1){
        $scope.showPrograms=false;
        $scope.selectedProgramId=$scope.userPrograms[0].id;
        loadStockCards(parseInt($scope.selectedProgramId,10),parseInt($scope.selectedFacilityId,10),$scope.useBarcode);

    }

    $scope.date = new Date();
    $scope.apply=function(){
        $scope.$apply();
    };

    $scope.showAdjustmentReason=function(lot)
    {

        $scope.oldAdjustmentReason = angular.copy(lot.AdjustmentReasons);
        $scope.currentStockLot = lot;
        $scope.currentStockLot.adjustmentReasons=((lot.adjustmentReasons === undefined)?[]:lot.adjustmentReasons);
        //Remove reason already exist from drop down
        reEvaluateTotalAdjustmentReasons();
        updateAdjustmentReasonForLot(lot.adjustmentReasons);
        $scope.adjustmentReasonsDialogModal = true;

    };
    $scope.removeAdjustmentReason=function(adjustment)
    {
        $scope.currentStockLot.adjustmentReasons = $.grep($scope.currentStockLot.adjustmentReasons, function (reasonObj) {
            return (adjustment !== reasonObj);
        });
        updateAdjustmentReasonForLot($scope.currentStockLot.adjustmentReasons);
        reEvaluateTotalAdjustmentReasons();
    };

    $scope.closeModal=function(){
        $scope.currentStockLot.adjustmentReasons = $scope.oldAdjustmentReason;
        reEvaluateTotalAdjustmentReasons();
        $scope.adjustmentReasonsDialogModal=false;
    };
    //Save Adjustment
    $scope.saveAdjustmentReasons = function () {
        $scope.modalError = '';
        $scope.clearAndCloseAdjustmentModal();
    };
    $scope.clearAndCloseAdjustmentModal = function () {
        reEvaluateTotalAdjustmentReasons();
        $scope.adjustmentReason = undefined;
        $scope.adjustmentReasonsDialogModal=false;

    };

    $scope.addAdjustmentReason=function(newAdjustmentReason)
    {
        var adjustmentReason={};
        adjustmentReason.type = newAdjustmentReason.type;
        adjustmentReason.name = newAdjustmentReason.type.name;
        adjustmentReason.quantity= newAdjustmentReason.quantity;

        $scope.currentStockLot.adjustmentReasons.push(adjustmentReason);
        updateAdjustmentReasonForLot($scope.currentStockLot.adjustmentReasons);
        reEvaluateTotalAdjustmentReasons();
        newAdjustmentReason.type = undefined;
        newAdjustmentReason.quantity = undefined;

    };
    $scope.updateStock=function(){
        console.log(JSON.stringify($scope.adjustmentForm));
        if($scope.adjustmentForm.$invalid)
        {
            $scope.showFormError=true;
            return;
        }
        var events=[];
        $scope.stockCardsToDisplay.forEach(function(st){
            st.stockCards.forEach(function(s){
                if(s.lotsOnHand !==undefined && s.lotsOnHand.length>0){
                    s.lotsOnHand.forEach(function(l){
                        if(l.quantity !== undefined)
                        {
                            l.adjustmentReasons.forEach(function(reason){
                                var event={};
                                event.type= "ADJUSTMENT";
                                event.productCode=s.product.code;
                                event.quantity=reason.quantity;
                                event.lotId=l.lot.id;
                                event.reasonName=reason.name;
                                if(l.customProps !==null && l.customProps.vvmstatus !==undefined)
                                {
                                    event.customProps={"vvmStatus":l.customProps.vvmstatus};
                                }
                                events.push(event);
                            });
                        }
                    });
                }
                else{
                    if(s.quantity !==undefined)
                    {
                        s.adjustmentReasons.forEach(function(reason){
                            var event={};
                            event.type= "ADJUSTMENT";
                            event.productCode=s.product.code;
                            event.quantity=reason.quantity;
                            event.reasonName=reason.name;
                            events.push(event);
                        });
                    }
                }
            });
        });
        StockEvent.save({facilityId:homeFacility.id},events, function (data) {
            if(data.success !==null)
            {
                $scope.message=data.success;
                $timeout(function(){
                    $window.location='/public/pages/vaccine/inventory/dashboard/index.html#/stock-on-hand';
                },900);
            }
        });
    };
    $scope.cancel=function(){
        $window.location='/public/pages/vaccine/inventory/dashboard/index.html#/stock-on-hand';
    };


    function reEvaluateTotalAdjustmentReasons()
    {
        var totalAdjustments = 0;
        $($scope.currentStockLot.adjustmentReasons).each(function (index, adjustmentObject) {
            if(adjustmentObject.type.additive)
            {
                totalAdjustments = totalAdjustments + parseInt(adjustmentObject.quantity,10);
            }else{
                totalAdjustments = totalAdjustments - parseInt(adjustmentObject.quantity,10);
            }

        });
        $scope.currentStockLot.totalAdjustments=totalAdjustments;
    }
    $scope.reEvaluateTotalAdjustmentReasons= function() {reEvaluateTotalAdjustmentReasons();};

    function updateAdjustmentReasonForLot(adjustmentReasons)
    {

        var additive;
        if($scope.currentStockLot.lot !==undefined){
            additive=($scope.currentStockLot.quantity - $scope.currentStockLot.quantityOnHand >=0)?true:false;
        }
        else  if($scope.currentStockLot.lot ===undefined)
        {
            additive=($scope.currentStockLot.quantity - $scope.currentStockLot.totalQuantityOnHand >=0)?true:false;
        }
        var adjustmentReasonsForLot = _.pluck(_.pluck(adjustmentReasons, 'type'), 'name');
        $scope.adjustmentReasonsToDisplay = $.grep($scope.adjustmentTypes, function (adjustmentTypeObject) {
            return $.inArray(adjustmentTypeObject.name, adjustmentReasonsForLot) == -1 && adjustmentTypeObject.additive === additive;
        });
    }

    //Load Right to check if user level can Send Requisition ond do stock adjustment
    $scope.loadRights = function () {
        $scope.rights = localStorageService.get(localStorageKeys.RIGHT);
    }();

    $scope.hasPermission = function (permission) {
        if ($scope.rights !== undefined && $scope.rights !== null) {
            var rights = JSON.parse($scope.rights);
            var rightNames = _.pluck(rights, 'name');
            return rightNames.indexOf(permission) > -1;
        }
        return false;
    };
    $scope.vvmTracked=function(c)
    {
        var config=_.filter(configurations.productsConfiguration, function(obj) {
            return obj.product.id===c.product.id;
        });

        if(config.length >0)
        {
            return config[0].vvmTracked;
        }
        else{
            return false;
        }
    };

}

BarcodeStockAdjustmentController.resolve = {

    homeFacility: function ($q, $timeout,UserFacilityList) {
        var deferred = $q.defer();
        var homeFacility={};

        $timeout(function () {
            //Home Facility
            //@todo Put these data in local storage and update the method to fetch from local store
            UserFacilityList.get({}, function (data) {
                homeFacility = data.facilityList[0];
                deferred.resolve(homeFacility);
            });

        }, 100);
        return deferred.promise;
    },
    configurations:function($q, $timeout, AllVaccineInventoryConfigurations) {
        var deferred = $q.defer();
        var configurations={};
        $timeout(function () {
            //@todo Put these data in local storage and update the method to fetch from local store
            AllVaccineInventoryConfigurations.get(function(data)
            {
                configurations=data;
                deferred.resolve(configurations);
            });
        }, 100);
        return deferred.promise;
    }
};