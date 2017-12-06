
      var best=window.localStorage.getItem("best-rects");
	  if(!best)
		  best=0;
	  document.getElementById('best-container').innerHTML=best;

 	 function StartGame(){
		
	  RemoveMessage();
	  
      var len=shapes.length;
	  for(var i=0; i<len; i++)
		  shapes.pop();
		 
	  mistakes=0;
	  score=0;
	  level=1;
	  document.getElementById('best-container').innerHTML=best;
	  document.getElementById('score-container').innerHTML=0;
	  Start=true;	
	  context.clearRect(0, 0, canvas.width, canvas.height);		
	}
	
	  function draw()
	  {
         var growing = false;
         for (var i=0; i<shapes.length; i++)
    	 {
          if(shapes[i].growing)
		  {
			 if(!RectangleInsideCanvas(shapes[i],canvas))
		     {
    		    shapes[i].growing=false;
    		  //  break;
    		 }
    		 for (var j=0; j<shapes.length; j++ )
			 {
    		     
    		     if(i!=j && RectanglesTouch(shapes[i],shapes[j]))
				 {    
			 
					 if (shapes[i].clr===shapes[j].clr)// delete shapes if they are the same color
					 {
//					    DrawRectangle(shapes[i]);
//						DrawRectangle(shapes[j]);						
						shapes.splice(i,1);
						if(i<j)
						  shapes.splice(j-1,1);
					    else
						  shapes.splice(j,1);
						redraw();
                                                swooshSound.play();
						return;
					 }
					 else
    			        shapes[i].growing=shapes[j].growing=false;
    				// break;  //contiue to search other shapes that touch shape i
    			 }
    			}
    		 if(shapes[i].growing)
			 {
			    shapes[i].width*=1.03;
				shapes[i].height*=1.03;
    		    growing =true;
			 }
             DrawRectangle(shapes[i]);
    	   }
    	  }
         if (growing==false)
    	      clearInterval(interv);     
     }
	 
	 
	 function StartRectangle(event){
	   if(!Start)
	      return;
//	   swooshSound.play(); //without that doesn't work on mobile
//	   swooshSound.stop();//
	   var rect = canvas.getBoundingClientRect();
       var x=(event.clientX-rect.left)/(rect.right-rect.left)*canvas.width;
       var y= (event.clientY-rect.top)/(rect.bottom-rect.top)*canvas.height;
	   
	   if ((i=PointInsideRectangles(x,y)) !=-1)   // regraw old rectangle
	   {
			shapes[i].growing=true;
			interv=setInterval(draw, 1000/30);
			return;
	   }
	   
       var s=new shape(x, y, "rectangle");
	   
       if (!RectangleInsideCanvas(s,canvas) || RectanglesIntersect(s) )
	   {
		    DrawMistakeRectangle(s);
			mistakes++;
			if(mistakes<3)
			     mistakeSound.play();
			if (mistakes==3)
			{
			   Start=false;
			   clearInterval(interv);
			   endOfGameSound.play();
			   messageContainer = document.querySelector(".game-message");
			   messageContainer.classList.add("game-over");
			   messageContainer.getElementsByTagName("p")[0].textContent ="Game over!";
			}			
		    return;
	    }
					
	   mistakes=0;
	   redraw();
	   shapes.push(s);
	   clearInterval(interv);
	   interv=setInterval(draw, 1000/30);
	   score+=level;
	   var newlevel= GetLevel(score);
	   document.getElementById('score-container').innerHTML=score;
	 
	   if(score > best)
	   {
	     best=score;
	     document.getElementById('best-container').innerHTML= best;
		 window.localStorage.setItem("best-rects", best);
		}
		if (newlevel>level){
                        newLevelSound.play();
			level=newlevel;
			messageContainer = document.querySelector(".game-message");
            messageContainer.classList.add("game-continue");
			var txt = "Conratulations! You've reached level "+ level +" !"
            messageContainer.getElementsByTagName("p")[0].textContent =txt;
		//	ShareScore();
		}
	 }
	 
	 
	 function PointInsideRectangles(x,y){
	    for (i=0; i<shapes.length; i++)
		  if( x > shapes[i].ct_x - shapes[i].width/2 && x <  shapes[i].ct_x + shapes[i].width/2 && y > shapes[i].ct_y - shapes[i].height/2 && y < shapes[i].ct_y + shapes[i].height/2 )
		      return i;
	    return -1;
	 }

	 function RectangleInsideCanvas(rect,canvas){
	   if(rect.ct_x-rect.width/2 < 0 || rect.ct_x+rect.width/2>canvas.width 
  	   || rect.ct_y-rect.height/2 < 0 || rect.ct_y+rect.height/2 >canvas.height)
		   return false;
		return true
	 }
	 function RectanglesIntersect(rect){		 
	    for(var i=0; i<shapes.length; i++)
		{		
	        if(RectanglesTouch(rect, shapes[i]))
	           return true;
		}
	   return false;	  
	 }
	 function RectanglesTouch(rect1, rect2)
	 {	
   
	    if(rect1.ct_x-rect1.width/2  > rect2.ct_x+rect2.width/2  || rect2.ct_x-rect2.width/2  > rect1.ct_x+rect1.width/2 )
			return false;
		if(rect1.ct_y+rect1.height/2  < rect2.ct_y-rect2.height/2  || rect2.ct_y+rect2.height/2  < rect1.ct_y-rect1.height/2 )
			return false;		
	    return true;	  
	 }
	 function DrawMistakeRectangle(rect)
	 {	   
	   var dotsPerShortSide=6;
	   
       var interval=Math.min(rect.width, rect.height)/dotsPerShortSide; 	

       for (var i=0; i<=rect.width; i+=interval)
	   {
		    var x= rect.ct_x-rect.width/2 +i;
			var y= rect.ct_y-rect.height/2;
			
		    context.beginPath();
            context.arc(x,y,.8,0,Math.PI*2);
			context.arc(x,y+rect.height,.8,0,Math.PI*2);
            context.closePath();
			context.fillStyle="#000000";
            context.fill();		   
	   }
	   for (var i=0; i<=rect.height; i+=interval)
	   {
		    var x= rect.ct_x-rect.width/2 ;
			var y= rect.ct_y-rect.height/2 +i;
			
		    context.beginPath();
            context.arc(x,y,.8,0,Math.PI*2);
			context.arc(x+rect.width,y,.8,0,Math.PI*2);
            context.closePath();
			context.fillStyle="#000000";
            context.fill();		   
	   }
	 }
	 
	 function DrawRectangle(r)
	 {
		context.beginPath();
        context.rect( r.ct_x - r.width/2, r.ct_y-r.height/2, r.width, r.height );
    	context.fillStyle = r.clr;
        context.fill(); 
	 }