export function addClass(el,className) {
	if(hasClass(el,className)){
		return
	}
	let newClass = el.className.split(' ')
	newClass.push(className)
	el.className = newClass.join(' ')
}

export function hasClass(el,className) {
	let reg = new RegExp('(^|\\s)'+className+'(\\s|$)')
	return reg.test(el.className)
}

export function getData(el,name,val) {
	const prefix = 'data-'
	name=prefix+name
	if(val){
		return el.setAttribute(name,val)
	}else{
		return el.getAttribute(name)
	}
}

export function format(time) {
	const WEEK = ["周日","周一","周二","周三","周四","周五","周六"]
	const TODAY = "2017-06-08"
	// time和today格式都应为YYYY-MM-DD
	let today = new Date(TODAY)
	let date = []
	let k = ''
	let i = new Date(time)
	if(i >= today){
		// 转换成相差的天数
		let j =parseInt((i.getTime() - today.getTime())/1000/3600/24)
		switch(j){
			case 0 :date.push("今天")
				break
			case 1 :date.push("明天")
				break
			case 2 :date.push("后天")
				break
			default :let m=i.getDay()
				date.push(WEEK[m])
		}
		date.push(time.slice(5,7).concat("月"))
		date.push(time.slice(8,10).concat("日"))
		k=date.join('')
		return k
	}
	return 
}