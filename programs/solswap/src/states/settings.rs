use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct Settings {
    pub admin: Pubkey,
}
