/* GET about page*/
module.exports.about = function(req, res) {
	res.render('generic-text', { 
		title: 'About Loc8r',
		content: 'Loc8r was created to help people find places to sit down and get work done.\n\n Lorem ipsum dolor sit amet...'
	
	});
};