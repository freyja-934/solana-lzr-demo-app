use anchor_lang::prelude::*;
use anchor_lang::prelude::InitSpace;
use anchor_lang::solana_program::program_error::ProgramError;

declare_id!("CBrNSSuPm5fa9AVdgeYrswKKAcvcmKN85hrgEtnXKj98");

#[program]
pub mod transfer_program {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn initialize_user(ctx: Context<InitializeUser>) -> Result<()> {
        let user = &mut ctx.accounts.user;
        user.author = ctx.accounts.author.key();
        user.message_count = 0;
        Ok(())
    }

    pub fn post_message(ctx: Context<PostMessage>, message: String) -> Result<()> {
        let user = &mut ctx.accounts.user;
        let message_account = &mut ctx.accounts.message_account;

        require!(
            user.author == ctx.accounts.author.key(),
            ErrorCode::InvalidUserAccount
        );

        message_account.author = ctx.accounts.author.key();
        message_account.message = message;
        message_account.index = user.message_count;
        message_account.timestamp = Clock::get()?.unix_timestamp as u64;

        user.message_count = user
            .message_count
            .checked_add(1)
            .ok_or(ErrorCode::MessageCountOverflow)?;

        emit!(MessagePosted {
            author: message_account.author,
            index: message_account.index,
            timestamp: message_account.timestamp,
            message: message_account.message.clone(),
        });

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

#[derive(Accounts)]
pub struct InitializeUser<'info> {
    #[account(mut)]
    pub author: Signer<'info>,

    #[account(
        init,
        payer = author,
        space = 8 + 32 + 8,
        seeds = [b"user-state", author.key().as_ref()],
        bump
    )]
    pub user: Account<'info, User>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PostMessage<'info> {
    #[account(mut)]
    pub author: Signer<'info>,

    #[account(
        mut,
        seeds = [b"user-state", author.key().as_ref()],
        bump
    )]
    pub user: Account<'info, User>,

    #[account(
        init,
        payer = author,
        space = 8 + Message::INIT_SPACE,
        seeds = [b"message", author.key().as_ref(), &user.message_count.to_le_bytes()],
        bump
    )]
    pub message_account: Account<'info, Message>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct User {
    pub author: Pubkey,
    pub message_count: u64,
}

#[account]
#[derive(InitSpace)]
pub struct Message {
    pub author: Pubkey,
    #[max_len(256)]
    pub message: String,
    pub index: u64,
    pub timestamp: u64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid user account")]
    InvalidUserAccount,
    #[msg("User message count overflowed")]
    MessageCountOverflow,
}

#[event]
#[derive(Clone)]
pub struct MessagePosted {
    pub author: Pubkey,
    pub index: u64,
    pub timestamp: u64,
    #[max_len(256)]
    pub message: String,
}
