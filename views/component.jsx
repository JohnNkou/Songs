const React = require('react')

exports.CatList = ({catNames,current, setCurrentCat})=>
	<div className='il'>
		{catNames.map((cat,i)=>
			<p key={i} style={{backgroundColor:(current == cat)?'red':'black'}} onClick={()=> { setCurrentCat(cat)}}>{cat}</p>
		)}
	</div>

exports.SongList = ({songs,current, setCurrentSong})=>
	<div className="il">
		{songs.map((song,i)=>
			<p key={i} style={{color:(current == song.name)?'yellow':'black'}} onClick={()=> setCurrentSong(song.name)}>{song.name}</p>
		)}
	</div>