import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function PlantCard(props) {
    const role = localStorage.getItem('role');
    return (
        <Card className='plant-card' sx={{ width: 270 }}>
            <CardMedia
                sx={{ height: 200 }}
                image={props.img}
                title={props.name}
            />
            <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                    <span style={{fontWeight:'bold'}}>{props.name}</span>
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    <span>Price: ₹{props.price}</span>
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {props.stock === 0 ? (
                        <span className="out-of-stock-cart">Out of Stock</span>
                    ) : props.stock <= 10 ? (
                        <span className="only-few-cart">Only {props.stock} plants left.</span>
                    ) : (
                        <span className="available-cart">Available</span>
                    )}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" style={{width:'100%',backgroundColor:'#3E5F44', color:'#E8FFD7', padding:8,fontFamily:`'Bubblegum Sans', cursive`}}>
                    {role==="admin"? "Add Stock":"Buy Now"}
                </Button>
            </CardActions>
        </Card>
    );
}
