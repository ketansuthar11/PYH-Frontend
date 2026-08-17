import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

export default function PlantCard(props) {
    const role = localStorage.getItem('role');
    return (
        <Card className='plant-card'>
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
                <button className="plant-card-button">{role === "admin" ? "Manage stock" : "View plant"}</button>
            </CardActions>
        </Card>
    );
}
