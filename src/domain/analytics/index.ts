type AnalyticFromServer = [{
    one: string;
    two: string;
    six: string;
}, {
    value: number;
}, {
    value: number;
}, {
    value: string;
}, {
    value: string[];
}]

class AnalyticsDomain {
	one: string
	two: string
	three: number
	four: number
	five: string
	six: string
	seven: string[]
	constructor(analytics: AnalyticsDomain){
		this.one = analytics.one
		this.two = analytics.two
		this.three = analytics.three
		this.four = analytics.four
		this.five = analytics.five
		this.six = analytics.six
		this.seven = analytics.seven
	}

	static analyticsFromServer(data: AnalyticFromServer){
		const { one, two, six} = data[0];
		const { value: three } = data[1];
		const { value: four } = data[2];
		const {value: five} = data[3];
		const { value: seven} = data[4];
		return new AnalyticsDomain({
			one,
			two,
			three,
			four,
			five,
			six,
			seven,
		})
	}
}

export default AnalyticsDomain;