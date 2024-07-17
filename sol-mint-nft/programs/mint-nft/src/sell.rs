use anchor_lang::{
    prelude::*, 
    system_program
};
use anchor_spl::{
    associated_token,
    associated_token::AssociatedToken,
    token,
    token::Token,
};

pub fn sell(ctx: Context<SellNft>, sale_lamports: u64) -> Result<()> {
    system_program::transfer(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.buyer_authority.to_account_info(),
                to: ctx.accounts.owner_authority.to_account_info(),
            },
        ),
        sale_lamports,
    )?;

    associated_token::create(CpiContext::new(
        ctx.accounts.associated_token_program.to_account_info(),
        associated_token::Create {
            payer: ctx.accounts.buyer_authority.to_account_info(),
            associated_token: ctx.accounts.buyer_token_account.to_account_info(),
            authority: ctx.accounts.buyer_authority.to_account_info(),
            mint: ctx.accounts.mint.to_account_info(),
            system_program: ctx.accounts.system_program.to_account_info(),
            token_program: ctx.accounts.token_program.to_account_info(),
        },
    ))?;

    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.owner_token_account.to_account_info(),
                to: ctx.accounts.buyer_token_account.to_account_info(),
                authority: ctx.accounts.owner_authority.to_account_info(),
            },
        ),
        1,
    )?;

    Ok(())
}

#[derive(Accounts)]
pub struct SellNft<'info> {
    #[account(mut)]
    pub mint: Account<'info, token::Mint>,

    #[account(mut)]
    pub owner_token_account: Account<'info, token::TokenAccount>,

    #[account(mut)]
    pub owner_authority: Signer<'info>,

    /// CHECK: We're about to create this with Anchor
    #[account(mut)]
    pub buyer_token_account: UncheckedAccount<'info>,

    #[account(mut)]
    pub buyer_authority: Signer<'info>,

    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}
