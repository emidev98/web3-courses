pub mod mint;
pub mod sell;

use {
    anchor_lang::prelude::*,
    mint::*,
    sell::*,
};

declare_id!("");

#[program]
pub mod mint_nft {
    use super::*;
    
    pub fn mint(
        ctx: Context<MintNft>,
        metadata_title: String,
        metadata_symbol: String,
        metadata_uri: String,
    ) -> Result<()> {
        mint::mint(ctx, metadata_title, metadata_symbol, metadata_uri)
    }
    
    pub fn sell(
        ctx: Context<SellNft>,
        sale_lamports: u64,
    ) -> Result<()> {
        sell::sell(ctx, sale_lamports)
    }
}
