import chroma from 'chroma-js';

const shadeGenerator = (color: string, count: number) => {
	const step = Math.floor(80 / count);
	const [h] = chroma(color).hsl();
	const getParam = (id: number) => (20 + step * id)/100;
	const newColor = (id: number) => chroma(Math.floor(h), getParam(id), getParam(id), 'hsl').hex();
	return Array.from({ length: count}).map((_, idx) => newColor(idx));
}

export default shadeGenerator;