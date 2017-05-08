angular.module("myApp",[])
    .controller("ctrl",["$scope","$filter",function ($scope,$filter) {
        /*将存储在本地localstorage的数据转化为json格式*/
        $scope.data=localStorage.data?JSON.parse(localStorage.data):[];
        console.log($scope.data);
        //完成的数据
        $scope.done=localStorage.done?JSON.parse(localStorage.done):[];
        console.log($scope.done);
        $scope.format = new Date(); //获取当前时间


        //当前选择的事项
        $scope.currentIndex=0;
        $scope.currentCon=$scope.data[$scope.currentIndex];


        //监控search，操作两个地方：在视图添加管道，
        $scope.search="";
        $scope.$watch("search",function(){
            var arr=$filter("filter")($scope.data,{title:$scope.search});
            $scope.currentIndex=0;
            $scope.currentCon=arr[$scope.currentIndex]
        })

        /*添加事项*/
        $scope.addList=function () {
            $scope.len=0;

            //保存添加的所有信息----包括子信息，时间等
            var obj={};
            obj.id=getMaxId($scope.data);
            obj.title="新建事项"+obj.id;
            obj.time=$scope.format;
            obj.son=[];

            $scope.data.push(obj);  //把所有保存在obj中的信息放入data中保存
            /*包含子条目
                [{id:1,title:"1",
                    son{id:1,title:"1-1"},
                    son{id:2,title:"1-2"},
                }]
            */

            $scope.currentIndex=getIndex($scope.data,obj.id);
            $scope.currentCon=$scope.data[$scope.currentIndex];

            localStorage.data=JSON.stringify($scope.data);
        }

        /*删除列表*/
        $scope.removeList=function(id){
            angular.forEach($scope.data,function(obj,index){
                if(id==obj.id){
                    $scope.data.splice(index,1);
                    var index=getIndex(id);
                    $scope.len-=obj.son.length;
                    if(index==$scope.data.length-1){ /*如果删除的是最后一个*/
                        $scope.currentIndex=index-1;
                        $scope.currentCon=$scope.data[$scope.currentIndex];
                    }else{
                        $scope.currentIndex=$scope.data.length-1;
                        $scope.currentCon=$scope.data[$scope.currentIndex];
                    }
                }
            })
            localStorage.data=JSON.stringify($scope.data);
        }

        /*列表获得焦点*/
        $scope.focus=function(id){
            var index=getIndex($scope.data,id);
            $scope.currentIndex=index;
            $scope.currentCon=$scope.data[$scope.currentIndex];

        }

        /*失去焦点*/
        $scope.blur=function(id){
            localStorage.data=JSON.stringify($scope.data);
        }

        /*添加子信息*/
        $scope.addOpt=function(){
            $scope.len++;
            var obj={};
            var id=getMaxId($scope.currentCon.son);
            obj.id=id;
            obj.title="新建条目"+obj.id;
            obj.somTime=$scope.format;
            $scope.currentCon.son.push(obj); /*给当前son里添加*/
            console.log($scope.currentCon.son);

            localStorage.data=JSON.stringify($scope.data);
        }

        /*删除子信息*/
        $scope.delOpt=function(id){
            $scope.len--;
            var index=getIndex($scope.currentCon.son,id);
            $scope.currentCon.son.splice(index,1);
            localStorage.data=JSON.stringify($scope.data);
        }

        /*子信息完成*/
        $scope.doneFun=function(id){
            $scope.len--;
            var index=getIndex($scope.currentCon.son,id);
            console.log(index);
            //1. 原数组删除
            var obj=$scope.currentCon.son.splice(index,1);

            obj[0].ti=$scope.currentCon.time;
            //2. 要将删除的元素放到done数组里面;
            obj[0].pare=$scope.currentCon.title;
            obj[0].id=getMaxId($scope.done);
            $scope.done.push(obj[0]);

            localStorage.data=JSON.stringify($scope.data);
            localStorage.done=JSON.stringify($scope.done);
        }

        //是否显示完成列表
        $scope.isshow=true;
        /*显示已完成内容*/
        $scope.showDone= function(){
            $scope.isshow = false;
        }
        /*显示未完成内容*/
        $scope.showCon=function(){
            $scope.isshow = true;
        }

        /*删除已完成*/
        $scope.removeDone=function(id){
            var index=getIndex($scope.done,id);
            $scope.done.splice(index,1);
            localStorage.done=JSON.stringify($scope.done);
        }
        
        /*最大id*/
        function getMaxId(arr) {
            if(arr.length==0){
                return 1;
            }else{
                var temp=arr[0].id;
                for(var i=0;i<arr.length;i++){
                    if(arr[i].id>temp){
                        temp=arr[i].id;
                    }
                }
                return temp+1;
            }
        }

        /*下标*/
        function getIndex(arr,id) {
            for(var i=0;i<arr.length;i++){
                if(arr[i].id==id){
                    return i;
                }
            }
        }
        if($scope.data.length!==0){
            $scope.len="";
            angular.forEach($scope.data,function (obj,index) {
                $scope.len+=$scope.data[index].son.length+"+";
            });
            $scope.len=eval($scope.len.slice(0,-1));
            // console.log($scope.len);
        }else if($scope.data.length==0){
            $scope.len=0;
        }
    }])