/*alert("Know the meaning of your name!");
alert("You can even screenshot your output and do upvote if you like it.");
alert("Type your name and press meaning to know the meaning");*/
function Meaning(){
	var name = list.value.toUpperCase(), arr, ch, r_num;
	for (var i = 0; i < name.length; i++){
		ch=name.charAt(i);
		switch(ch){
			case 'A':
				arr = new Array ("mazing","stounding","cademic","ccelerated","cceptable","ccessible","cclaimed","ccommodating","ccomplished","ccordant","ccurate");
				r_num = Math.floor(Math.random()*11);
				break;
			case 'B':
				arr = new Array ("rilliant","oring","eneficiary","est","estower","etter","igwig","lazing","lessed","liss");
				r_num = Math.floor(Math.random()*10);
				break;
			case 'C':
				arr = new Array ("aring","urious","oy","ourageous","onvincing","ontented","hipper","lean","onquerer","onsoler","onservator","hosen","alm");
				r_num = Math.floor(Math.random()*13);
				break;
			case 'D':
				arr = new Array ("aring","ictator","ainty","apper","ashing","auntless","azzling","ear","ebonair","ecent","ecisive","edicated");
				r_num = Math.floor(Math.random()*12);
				break;
			case 'E':
				arr = new Array ("xcellent","xotic","ager","arnest","arthly","asy","asygoing","bullient","clectic","conomical","cstatic","cumenical","dified","ducated","ducational","ffective","ffectual","ffervescent","fficient","ffortless","ffulgent");
				r_num = Math.floor(Math.random()*21);
				break;								   
			case 'F':
				arr = new Array ("atherly","ascinating","earful","earless","earsome","easible","eathery","eminist","eudalistic","ictitious","ilmy","ine","it","lamboyant","lashy");
				r_num = Math.floor(Math.random()*15);
				break;
			case 'G':
				arr = new Array ("ood","utsy","raceful","racious","radual","rand","rateful","rave","reat","reedy");
				r_num = Math.floor(Math.random()*10);
				break;
			case 'H':
				arr = new Array ("ero","umane","umanitarian","umble","umorous","yperactive","ypnotic","ypocritical","ypothetical","ysterical");
				r_num = Math.floor(Math.random()*10);
				break;
			case 'I':
				arr = new Array ("ntelligent","nspiring","deal","dealistic","dentifiable","deological","diomatic","diosyncratic","diotic","dle");
				r_num = Math.floor(Math.random()*10);
				break;
			case 'J':
				arr = new Array ("ocular","ovial","oyful","oyless","oyous","ubilant","udgmental","udicious","umbo","ust","uvenile");
				r_num = Math.floor(Math.random()*11);
				break;								   
			case 'K':
				arr = new Array ("ind","indred","ing","nowledgeable");
				r_num = Math.floor(Math.random()*4);
				break;
			case 'L':
				arr = new Array ("ovely","oving","oyal","ucid","ucky","unar","uxurious");
				r_num = Math.floor(Math.random()*7);
				break;								   
			case 'M':
				arr = new Array ("agical","agnetic","agnificent","aiden","ain","ajestic","ajor","ammoth","anageable","anagerial","anipulative,");
				r_num = Math.floor(Math.random()*11);
				break;
			case 'N':
				arr = new Array ("ascent","ice","ationalist","aive","atural");
				r_num = Math.floor(Math.random()*5);
				break;
			case 'O':
				arr = new Array ("bedient","bese","bligatory","bliging","ptimistic","dd","ld","mnipresent");
				r_num = Math.floor(Math.random()*8);
				break;								   
			case 'P':
				arr = new Array ("atient","atriotic","atronizing","eaceful","eculiar","erfect","erformer","ersuasive","retty","hotogenic","ioneering","oetic");
				r_num = Math.floor(Math.random()*12);
				break;
			case 'Q':
				arr = new Array ("uaint","uality","uantitative","uestionable","uick","uiet","uintessential","uirky");
				r_num = Math.floor(Math.random()*8);
				break;
			case 'R':
				arr = new Array ("etro","everend","everential","evolutionary","ewarding","hetorical","ich","ighteous");
				r_num = Math.floor(Math.random()*8);
				break;
			case 'S':
				arr = new Array ("mooth","ober","ocial","ocialist","oft","oft-spoken","orrowful","orry","oulful","ound");
				r_num = Math.floor(Math.random()*10);
				break;								   
			case 'T':
				arr = new Array ("echnical","echnological","edious","een","emporary","ense","errific","rusted");
				r_num = Math.floor(Math.random()*8);
				break;
			case 'U':
				arr = new Array ("pstart","rbane","rgent","seful","sual","topian");
				r_num = Math.floor(Math.random()*6);
				break;	
			case 'V':
				arr = new Array ("iable","ibrant","ictorian","ictorious","ital","ocal");
				r_num = Math.floor(Math.random()*6);
				break;
			case 'W':
				arr = new Array ("ise","ishful","itty","obbly","onderful","ondrous","orld-famous","orthy");
				r_num = Math.floor(Math.random()*8);
				break;
			case 'X':
				arr = new Array ("erox","-factor","enial");
				r_num = Math.floor(Math.random()*3);
				break;								   
			case 'Y':
				arr = new Array ("oung","ounger","oungest","outhful");
				r_num = Math.floor(Math.random()*4);
				break;
			case 'Z':
				arr = new Array ("eal","est");
				r_num = Math.floor(Math.random()*2);
				break;
			default: document.write("\n\n");
				continue;
		}
		document.write('<span style = "color: orange; font-size: 55px">' + ch + '</span>' + '<span style="font-size:25px">' + arr[r_num].toUpperCase() + '</span><br/>');
	}
}