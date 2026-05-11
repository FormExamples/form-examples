use crate::scoring::types::Band;

pub fn max_band(bands: &[Band]) -> Band {
    bands.iter().copied().max().unwrap_or(Band::Low)
}
