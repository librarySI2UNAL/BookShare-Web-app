import { ProductItem } from "./productItem";
import { User } from "./user";
import { Photo } from "./photo";

export class Product
{
	id: number;
	description: string;
	special: boolean;
	available: boolean;
	cover: number;
	status: number;
	value: number;
	code: string;
	codeType: string;
	photos: Array<Photo>;
	productItem: ProductItem;
	user: User;

	constructor( data: any )
	{
		if( Object.keys( data ).length === 0 )
		{
			this.id = null;
			this.description = "";
			this.special = null;
			this.available = null;
			this.cover = null;
			this.status = null;
			this.value = null;
			this.code = null;
			this.codeType = null;
			this.photos = [];
			this.productItem = new ProductItem( {} );
			this.user = null;
		}
		else
		{
			this.id = data.id;
			this.description = data.description;
			this.special = data.special;
			this.available = data.available;
			this.cover = data.cover;
			this.status = data.status;
			this.value = data.value;
			this.code = data.code;
			this.codeType = data.codeType;
			this.photos = data.photos;
			this.productItem = new ProductItem( data.productItem );
			this.user = data.user;
		}
	}
}