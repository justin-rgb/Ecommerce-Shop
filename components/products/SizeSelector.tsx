import { Box, Button } from "@mui/material"
import { FC } from "react";
import { ISize } from "../../interfaces";

interface Props {
    selectedSize?: ISize;
    sizes: ISize[];

    onSelectedSize: (size: ISize) => void;
}

export const SizeSelector: FC<Props> = ({ selectedSize, sizes, onSelectedSize }) => {

    return (
        <Box>
            {
                sizes.map( size => (
                    <Button
                        key={ size }
                        size='small'
                        color={'info'}  
                        sx={{
                            backgroundColor: selectedSize === size ? 'black' : 'transparent',
                        }}
                        onClick={ () => {
                            if(selectedSize === size){
                                size = ''
                            }else{
                                onSelectedSize(size) 
                            }
                        }}
                    >
                        { size }
                    </Button>
                ))
            }
        </Box>
    )
}
