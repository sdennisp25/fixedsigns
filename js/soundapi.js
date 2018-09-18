(function () {

	var freesound = function () {        
			var authHeader = '';
			var clientId = '';
			var clientSecret = '';
			var host = 'freesound.org';

			var uris = {
					base : 'https://'+host+'/apiv2',
					textSearch : '/search/text/',
					contentSearch: '/search/content/',
					combinedSearch : '/sounds/search/combined/',
					sound : '/sounds/<sound_id>/',
					soundAnalysis : '/sounds/<sound_id>/analysis/',
					similarSounds : '/sounds/<sound_id>/similar/',
					comments : '/sounds/<sound_id>/comments/',
					download : '/sounds/<sound_id>/download/',
					upload : '/sounds/upload/',
					describe : '/sounds/<sound_id>/describe/',
					pending : '/sounds/pending_uploads/',
					bookmark : '/sounds/<sound_id>/bookmark/',
					rate : '/sounds/<sound_id>/rate/',
					comment : '/sounds/<sound_id>/comment/',
					authorize : '/oauth2/authorize/',
					logout : '/api-auth/logout/',
					logoutAuthorize : '/oauth2/logout_and_authorize/',
					me : '/me/',
					user : '/users/<username>/',
					userSounds : '/users/<username>/sounds/',
					userPacks : '/users/<username>/packs/',
					userBookmarkCategories : '/users/<username>/bookmark_categories/',
					userBookmarkCategorySounds : '/users/<username>/bookmark_categories/<category_id>/sounds/',
					pack : '/packs/<pack_id>/',
					packSounds : '/packs/<pack_id>/sounds/',
					packDownload : '/packs/<pack_id>/download/'            
			};
			
			var makeUri = function (uri, args){
					for (var a in args) {uri = uri.replace(/<[\w_]+>/, args[a]);}
					return uris.base+uri;
			};

			var makeRequest = function (uri, success, error, params, wrapper, method, data, content_type){
					if(method===undefined) method='GET';
					if(!error)error = function(e){console.log(e)};
					params = params || {};
					params['format'] = 'json';
					var fs = this;
					var parse_response = function (response){
							var data = eval("(" + response + ")");
							success(wrapper?wrapper(data):data);
					};                      
					var paramStr = "";
					for(var p in params){paramStr = paramStr+"&"+p+"="+params[p];}
					if (paramStr){
							uri = uri +"?"+ paramStr;
					}
					
					if (typeof module !== 'undefined'){ // node.js
							var http = require("http");
							var options = {
									host: host,
									path: uri.substring(uri.indexOf("/",8),uri.length), // first '/' after 'http://'
									port: '80',
									method: method,
									headers: {'Authorization': authHeader}
							};
							var req = http.request(options,function(res){
								var result = '';
									res.setEncoding('utf8');            
									res.on('data', function (data){ 
											result += data;
									});
									res.on('end', function() {
										if([200,201,202].indexOf(res.statusCode)>=0)
													success(wrapper?wrapper(data):data);
											else   
													error(data);
									});
							});                
							req.on('error', error).end();
					}
					else{ // browser
							var xhr;
							try {xhr = new XMLHttpRequest();}
							catch (e) {xhr = new ActiveXObject('Microsoft.XMLHTTP');}

							xhr.onreadystatechange = function(){
									if (xhr.readyState === 4 && [200,201,202].indexOf(xhr.status)>=0){
											var data = eval("(" + xhr.responseText + ")");
											if(success) success(wrapper?wrapper(data):data);
									}
									else if (xhr.readyState === 4 && xhr.status !== 200){
											if(error) error(xhr.statusText);
									}
							};
							xhr.open(method, uri);
							xhr.setRequestHeader('Authorization',authHeader);
							if(content_type!==undefined)
									xhr.setRequestHeader('Content-Type',content_type);
							xhr.send(data);
					}
	};
	var checkOauth = function(){
			if(authHeader.indexOf("Bearer")==-1)
					throw("Oauth authentication required");
	};

			
	var SoundObject = function (jsonObject){ 
			jsonObject.getAnalysis = function(filter, success, error, showAll){
					var params = {all: showAll?1:0};
					makeRequest(makeUri(uris.soundAnalysis,[jsonObject.id,filter?filter:""]),success,error);
			};

		 
jsonObject.comment = function (commentStr, success, error){
					checkOauth();
					var data = new FormData();
					data.append('comment', comment);
					var uri = makeUri(uris.comment,[jsonObject.id]);
					makeRequest(uri, success, error, {}, null, 'POST', data);
			};



			return jsonObject;
	};
			
	var PackObject = function(jsonObject){
			jsonObject.sounds = function (success, error){
					var uri = makeUri(uris.packSounds,[jsonObject.id]);
					makeRequest(uri, success, error,{},SoundCollection);            
			};
	};
							
	return {
					// authentication
					setToken: function (token, type) {
							authHeader = (type==='oauth' ? 'Bearer ':'Token ')+token;
					},
					setClientSecrets: function(id,secret){
							clientId = id;
							clientSecret = secret;
					},

					postAccessCode: function(code, success, error){
							var post_url = uris.base+"/oauth2/access_token/"
							var data = new FormData();
							data.append('client_id',clientId);
							data.append('client_secret',clientSecret);
							data.append('code',code);
							data.append('grant_type','authorization_code');
															
							if (!success){
									success = function(result){
											setToken(result.access_token,'oauth');                        
									}
							}
							makeRequest(post_url, success, error, {}, null, 'POST', data);
					},

					getSound: function(soundId,success, error){
							makeRequest(makeUri(uris.sound, [soundId]), success,error,{}, SoundObject);
					},

					getPendingSounds: function(success,error){
							checkOauth();
							makeRequest(makeUri(uris.pending), success,error,{});
					},

					// user resources
					me: function(success,error){
							checkOauth();
							makeRequest(makeUri(uris.me), success,error);
					},
			}    
	};

	// compatible with CommonJS (node), AMD (requireJS) failing back to browser global 
	// working with node requires web-audio-api module
	if (typeof module !== 'undefined') {module.exports = freesound(); }
	else if (typeof define === 'function' && typeof define.amd === 'object') { define("freesound", [], freesound); }
	else {this.freesound = freesound(); }
}());