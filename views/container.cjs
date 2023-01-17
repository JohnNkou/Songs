import { connect }  from 'react-redux'
import { First, Second }  from './components.jsx'
import * as Action  from '../utilis/aCreator.cjs'
import { store1, store2, Action1, Action2 } from '../utilis/BrowserDb.cjs'

export const CCatList = connect((state)=>{
	return {
		...store1(state)
	}
},{...Action1(Action)})(First)

export const CSongList = connect((state)=>{
	return { ...store2(state)};
},{ ...Action2(Action)})(Second)