use crate::scoring::types::RagBand;

pub fn worst_band(bands: &[RagBand]) -> RagBand {
    bands.iter().copied().max_by_key(|b| b.rank()).unwrap_or(RagBand::Green)
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn worst_of_green_amber_is_amber() {
        assert_eq!(worst_band(&[RagBand::Green, RagBand::Amber]), RagBand::Amber);
    }
    #[test]
    fn worst_of_amber_red_is_red() {
        assert_eq!(worst_band(&[RagBand::Amber, RagBand::Red]), RagBand::Red);
    }
    #[test]
    fn worst_of_empty_is_green() {
        assert_eq!(worst_band(&[]), RagBand::Green);
    }
}
