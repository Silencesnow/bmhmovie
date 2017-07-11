export function saveToLocal(orderId, showNo, seatIds) {
	let data = {
			show_seq_no:showNo,
			seatIds:seatIds
		}
	window.localStorage.setItem(orderId,JSON.stringify(data))
}

export function loadFromLocal(orderId,def) {
	let data = window.localStorage.getItem(orderId)
	if (!data) {
		return def
	}
	let order = JSON.parse(data)
	return order
}

export function clearLocalStorage() {
	window.localStorage.clear()
}
